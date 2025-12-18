import React, { useState, useEffect } from 'react';
import { X, Save, TreePine } from 'lucide-react';
import { forestsAPI } from '../../services/api';

const ForestForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    forest_name: '',
    geo_location: '',
    area_size: '',
    ownership_type: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const ownershipTypes = ['Private', 'Government', 'Corporate', 'Community'];
  const statuses = ['Active', 'Inactive', 'Under Review'];

  useEffect(() => {
    if (item) {
      setFormData({
        forest_name: item.forest_name || '',
        geo_location: item.geo_location || '',
        area_size: item.area_size || '',
        ownership_type: item.ownership_type || '',
        status: item.status || 'Active',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.forest_name.trim()) newErrors.forest_name = 'Forest name is required';
    if (!formData.geo_location.trim()) newErrors.geo_location = 'Location is required';
    if (!formData.area_size) newErrors.area_size = 'Area size is required';
    if (!formData.ownership_type) newErrors.ownership_type = 'Ownership type is required';
    
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
        area_size: parseFloat(formData.area_size),
      };

      if (item) {
        await forestsAPI.update(item.forest_id, submitData);
      } else {
        await forestsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving forest:', error);
      alert('Error saving forest. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <TreePine size={24} />
            <h2>{item ? 'Edit Forest' : 'Add New Forest'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="forest_name">Forest Name *</label>
              <input
                id="forest_name"
                name="forest_name"
                type="text"
                value={formData.forest_name}
                onChange={handleChange}
                className={errors.forest_name ? 'error' : ''}
                placeholder="Green Pine Forest"
              />
              {errors.forest_name && <span className="error-text">{errors.forest_name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="geo_location">Geographic Location *</label>
              <input
                id="geo_location"
                name="geo_location"
                type="text"
                value={formData.geo_location}
                onChange={handleChange}
                className={errors.geo_location ? 'error' : ''}
                placeholder="45.5231° N, 122.6765° W"
              />
              {errors.geo_location && <span className="error-text">{errors.geo_location}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="area_size">Area Size (acres) *</label>
                <input
                  id="area_size"
                  name="area_size"
                  type="number"
                  step="0.01"
                  value={formData.area_size}
                  onChange={handleChange}
                  className={errors.area_size ? 'error' : ''}
                />
                {errors.area_size && <span className="error-text">{errors.area_size}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="ownership_type">Ownership Type *</label>
                <select
                  id="ownership_type"
                  name="ownership_type"
                  value={formData.ownership_type}
                  onChange={handleChange}
                  className={errors.ownership_type ? 'error' : ''}
                >
                  <option value="">Select Type</option>
                  {ownershipTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.ownership_type && <span className="error-text">{errors.ownership_type}</span>}
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

export default ForestForm;