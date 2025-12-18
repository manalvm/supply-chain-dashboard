import React, { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';
import { processingUnitsAPI, sawmillsAPI } from '../../services/api';

const ProcessingUnitForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    sawmill_id: '',
    cutting: '',
    drying: '',
    finishing: '',
    capacity: '',
    status: 'Active',
  });
  const [sawmills, setSawmills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Active', 'Inactive', 'Maintenance'];

  useEffect(() => {
    fetchSawmills();
    if (item) {
      setFormData({
        sawmill_id: item.sawmill_id || '',
        cutting: item.cutting || '',
        drying: item.drying || '',
        finishing: item.finishing || '',
        capacity: item.capacity || '',
        status: item.status || 'Active',
      });
    }
  }, [item]);

  const fetchSawmills = async () => {
    try {
      const response = await sawmillsAPI.getAll();
      setSawmills(response.data);
    } catch (error) {
      console.error('Error fetching sawmills:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.sawmill_id) newErrors.sawmill_id = 'Sawmill is required';
    if (!formData.cutting.trim()) newErrors.cutting = 'Cutting method is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    
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
        sawmill_id: parseInt(formData.sawmill_id),
        capacity: parseFloat(formData.capacity),
      };

      if (item) {
        await processingUnitsAPI.update(item.unit_id, submitData);
      } else {
        await processingUnitsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving processing unit:', error);
      alert('Error saving processing unit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Settings size={24} />
            <h2>{item ? 'Edit Processing Unit' : 'Add Processing Unit'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="sawmill_id">Sawmill *</label>
              <select
                id="sawmill_id"
                name="sawmill_id"
                value={formData.sawmill_id}
                onChange={handleChange}
                className={errors.sawmill_id ? 'error' : ''}
              >
                <option value="">Select Sawmill</option>
                {sawmills.map(sawmill => (
                  <option key={sawmill.sawmill_id} value={sawmill.sawmill_id}>
                    {sawmill.name} - {sawmill.location}
                  </option>
                ))}
              </select>
              {errors.sawmill_id && <span className="error-text">{errors.sawmill_id}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="cutting">Cutting Method *</label>
              <input
                id="cutting"
                name="cutting"
                type="text"
                value={formData.cutting}
                onChange={handleChange}
                className={errors.cutting ? 'error' : ''}
                placeholder="Automated Band Saw"
              />
              {errors.cutting && <span className="error-text">{errors.cutting}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="drying">Drying Method</label>
              <input
                id="drying"
                name="drying"
                type="text"
                value={formData.drying}
                onChange={handleChange}
                placeholder="Kiln Dry - Type A"
              />
            </div>

            <div className="input-group">
              <label htmlFor="finishing">Finishing Method</label>
              <input
                id="finishing"
                name="finishing"
                type="text"
                value={formData.finishing}
                onChange={handleChange}
                placeholder="Planer & Sander"
              />
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="capacity">Capacity (units) *</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  step="0.01"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={errors.capacity ? 'error' : ''}
                />
                {errors.capacity && <span className="error-text">{errors.capacity}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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

export default ProcessingUnitForm;