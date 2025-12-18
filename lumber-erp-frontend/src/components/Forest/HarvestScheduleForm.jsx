import React, { useState, useEffect } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import { harvestSchedulesAPI, forestsAPI } from '../../services/api';

const HarvestScheduleForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    forest_id: '',
    start_date: '',
    end_date: '',
    status: 'Scheduled',
  });
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Scheduled', 'In Progress', 'Completed', 'Cancelled'];

  useEffect(() => {
    fetchForests();
    if (item) {
      setFormData({
        forest_id: item.forest_id || '',
        start_date: item.start_date ? item.start_date.split('T')[0] : '',
        end_date: item.end_date ? item.end_date.split('T')[0] : '',
        status: item.status || 'Scheduled',
      });
    }
  }, [item]);

  const fetchForests = async () => {
    try {
      const response = await forestsAPI.getAll();
      setForests(response.data);
    } catch (error) {
      console.error('Error fetching forests:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.forest_id) newErrors.forest_id = 'Forest is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    
    if (formData.start_date && formData.end_date && 
        new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date';
    }
    
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
      };

      if (item) {
        await harvestSchedulesAPI.update(item.schedule_id, submitData);
      } else {
        await harvestSchedulesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving schedule:', error);
      alert('Error saving schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Calendar size={24} />
            <h2>{item ? 'Edit Schedule' : 'Create Schedule'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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
                    {forest.forest_name} - {forest.area_size} acres
                  </option>
                ))}
              </select>
              {errors.forest_id && <span className="error-text">{errors.forest_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="start_date">Start Date *</label>
                <input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  className={errors.start_date ? 'error' : ''}
                />
                {errors.start_date && <span className="error-text">{errors.start_date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="end_date">End Date *</label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  className={errors.end_date ? 'error' : ''}
                />
                {errors.end_date && <span className="error-text">{errors.end_date}</span>}
              </div>
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

export default HarvestScheduleForm;