import React, { useState, useEffect } from 'react';
import { X, Save, Wrench } from 'lucide-react';
import { maintenanceRecordsAPI, processingUnitsAPI } from '../../services/api';

const MaintenanceRecordForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    unit_id: '',
    maintenance_date: '',
    description: '',
    cost: '',
    parts_used: '',
    downtime_hours: '',
  });
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUnits();
    if (item) {
      setFormData({
        unit_id: item.unit_id || '',
        maintenance_date: item.maintenance_date ? item.maintenance_date.split('T')[0] : '',
        description: item.description || '',
        cost: item.cost || '',
        parts_used: item.parts_used || '',
        downtime_hours: item.downtime_hours || '',
      });
    } else {
      setFormData(prev => ({ ...prev, maintenance_date: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchUnits = async () => {
    try {
      const response = await processingUnitsAPI.getAll();
      setUnits(response.data);
    } catch (error) {
      console.error('Error fetching units:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.unit_id) newErrors.unit_id = 'Processing unit is required';
    if (!formData.maintenance_date) newErrors.maintenance_date = 'Maintenance date is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.cost) newErrors.cost = 'Cost is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        unit_id: parseInt(formData.unit_id),
        cost: parseFloat(formData.cost),
        downtime_hours: parseFloat(formData.downtime_hours) || null,
      };

      if (item) {
        await maintenanceRecordsAPI.update(item.maintenance_id, submitData);
      } else {
        await maintenanceRecordsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving maintenance record:', error);
      alert('Error saving maintenance record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Wrench size={24} />
            <h2>{item ? 'Edit Maintenance Record' : 'Add Maintenance Record'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="unit_id">Processing Unit *</label>
              <select
                id="unit_id"
                name="unit_id"
                value={formData.unit_id}
                onChange={handleChange}
                className={errors.unit_id ? 'error' : ''}
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit.unit_id} value={unit.unit_id}>
                    Unit #{unit.unit_id} - {unit.cutting}
                  </option>
                ))}
              </select>
              {errors.unit_id && <span className="error-text">{errors.unit_id}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="maintenance_date">Maintenance Date *</label>
              <input
                id="maintenance_date"
                name="maintenance_date"
                type="date"
                value={formData.maintenance_date}
                onChange={handleChange}
                className={errors.maintenance_date ? 'error' : ''}
              />
              {errors.maintenance_date && <span className="error-text">{errors.maintenance_date}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                placeholder="Routine maintenance and blade replacement"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="parts_used">Parts Used</label>
              <input
                id="parts_used"
                name="parts_used"
                type="text"
                value={formData.parts_used}
                onChange={handleChange}
                placeholder="Band saw blade, bearings, lubricants"
              />
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="cost">Cost ($) *</label>
                <input
                  id="cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={handleChange}
                  className={errors.cost ? 'error' : ''}
                />
                {errors.cost && <span className="error-text">{errors.cost}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="downtime_hours">Downtime (hours)</label>
                <input
                  id="downtime_hours"
                  name="downtime_hours"
                  type="number"
                  step="0.1"
                  value={formData.downtime_hours}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : item ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceRecordForm;