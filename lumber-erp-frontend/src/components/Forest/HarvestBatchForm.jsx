import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { harvestBatchesAPI, forestsAPI, treeSpeciesAPI, harvestSchedulesAPI } from '../../services/api';

const HarvestBatchForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    forest_id: '',
    species_id: '',
    schedule_id: '',
    quantity: '',
    harvest_date: '',
    quality_indicator: '',
    qr_code: '',
  });
  const [forests, setForests] = useState([]);
  const [species, setSpecies] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const qualityIndicators = ['Premium', 'Standard', 'Economy', 'Grade B'];

  useEffect(() => {
    fetchData();
    if (item) {
      setFormData({
        forest_id: item.forest_id || '',
        species_id: item.species_id || '',
        schedule_id: item.schedule_id || '',
        quantity: item.quantity || '',
        harvest_date: item.harvest_date ? item.harvest_date.split('T')[0] : '',
        quality_indicator: item.quality_indicator || '',
        qr_code: item.qr_code || '',
      });
    } else {
      // Generate QR code for new batch
      setFormData(prev => ({
        ...prev,
        qr_code: `HB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      }));
    }
  }, [item]);

  const fetchData = async () => {
    try {
      const [forestRes, speciesRes, scheduleRes] = await Promise.all([
        forestsAPI.getAll(),
        treeSpeciesAPI.getAll(),
        harvestSchedulesAPI.getAll(),
      ]);
      setForests(forestRes.data);
      setSpecies(speciesRes.data);
      setSchedules(scheduleRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.forest_id) newErrors.forest_id = 'Forest is required';
    if (!formData.species_id) newErrors.species_id = 'Species is required';
    if (!formData.schedule_id) newErrors.schedule_id = 'Schedule is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.harvest_date) newErrors.harvest_date = 'Harvest date is required';
    if (!formData.quality_indicator) newErrors.quality_indicator = 'Quality indicator is required';
    
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
        forest_id: parseInt(formData.forest_id),
        species_id: parseInt(formData.species_id),
        schedule_id: parseInt(formData.schedule_id),
        quantity: parseFloat(formData.quantity),
      };

      if (item) {
        await harvestBatchesAPI.update(item.batch_id, submitData);
      } else {
        await harvestBatchesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving batch:', error);
      alert('Error saving batch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Package size={24} />
            <h2>{item ? 'Edit Harvest Batch' : 'Create Harvest Batch'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="forest_id">Forest *</label>
                <select
                  id="forest_id"
                  name="forest_id"
                  value={formData.forest_id}
                  onChange={handleChange}
                  className={errors.forest_id ? 'error' : ''}
                >
                  <option value="">Select Forest</option>
                  {forests.map(forest => (
                    <option key={forest.forest_id} value={forest.forest_id}>
                      {forest.forest_name}
                    </option>
                  ))}
                </select>
                {errors.forest_id && <span className="error-text">{errors.forest_id}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="species_id">Tree Species *</label>
                <select
                  id="species_id"
                  name="species_id"
                  value={formData.species_id}
                  onChange={handleChange}
                  className={errors.species_id ? 'error' : ''}
                >
                  <option value="">Select Species</option>
                  {species.map(s => (
                    <option key={s.species_id} value={s.species_id}>
                      {s.species_name} (Grade {s.grade})
                    </option>
                  ))}
                </select>
                {errors.species_id && <span className="error-text">{errors.species_id}</span>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="schedule_id">Harvest Schedule *</label>
              <select
                id="schedule_id"
                name="schedule_id"
                value={formData.schedule_id}
                onChange={handleChange}
                className={errors.schedule_id ? 'error' : ''}
              >
                <option value="">Select Schedule</option>
                {schedules.map(schedule => (
                  <option key={schedule.schedule_id} value={schedule.schedule_id}>
                    Schedule #{schedule.schedule_id} - {schedule.status}
                  </option>
                ))}
              </select>
              {errors.schedule_id && <span className="error-text">{errors.schedule_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="quantity">Quantity (units) *</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="harvest_date">Harvest Date *</label>
                <input
                  id="harvest_date"
                  name="harvest_date"
                  type="date"
                  value={formData.harvest_date}
                  onChange={handleChange}
                  className={errors.harvest_date ? 'error' : ''}
                />
                {errors.harvest_date && <span className="error-text">{errors.harvest_date}</span>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="quality_indicator">Quality Indicator *</label>
              <select
                id="quality_indicator"
                name="quality_indicator"
                value={formData.quality_indicator}
                onChange={handleChange}
                className={errors.quality_indicator ? 'error' : ''}
              >
                <option value="">Select Quality</option>
                {qualityIndicators.map(quality => (
                  <option key={quality} value={quality}>{quality}</option>
                ))}
              </select>
              {errors.quality_indicator && <span className="error-text">{errors.quality_indicator}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="qr_code">QR Code</label>
              <input
                id="qr_code"
                name="qr_code"
                type="text"
                value={formData.qr_code}
                onChange={handleChange}
                readOnly={!item}
                style={{ backgroundColor: item ? '' : 'var(--brown-50)' }}
              />
              <span className="help-text">Auto-generated for new batches</span>
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

export default HarvestBatchForm;