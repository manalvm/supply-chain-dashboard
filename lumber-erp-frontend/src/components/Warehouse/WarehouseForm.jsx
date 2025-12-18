import React, { useState, useEffect } from 'react';
import { X, Save, Warehouse } from 'lucide-react';
import { warehousesAPI } from '../../services/api';

const WarehouseForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    current_stock_level: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        location: item.location || '',
        capacity: item.capacity || '',
        current_stock_level: item.current_stock_level || '',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Warehouse name is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
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
        capacity: parseFloat(formData.capacity),
        current_stock_level: parseFloat(formData.current_stock_level) || 0,
      };

      if (item) {
        await warehousesAPI.update(item.warehouse_id, submitData);
      } else {
        await warehousesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving warehouse:', error);
      alert('Error saving warehouse. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Warehouse size={24} />
            <h2>{item ? 'Edit Warehouse' : 'Add New Warehouse'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="name">Warehouse Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="Main Warehouse"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="location">Location *</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                className={errors.location ? 'error' : ''}
                placeholder="123 Industrial Ave, Portland, OR"
              />
              {errors.location && <span className="error-text">{errors.location}</span>}
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
                <label htmlFor="current_stock_level">Current Stock Level</label>
                <input
                  id="current_stock_level"
                  name="current_stock_level"
                  type="number"
                  step="0.01"
                  value={formData.current_stock_level}
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

export default WarehouseForm;