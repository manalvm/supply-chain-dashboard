import React, { useState, useEffect } from 'react';
import { X, Save, UserCircle } from 'lucide-react';
import { driversAPI } from '../../services/api';

const DriverForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    license_number: '',
    experience_years: '',
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Active', 'Inactive', 'On Leave', 'Suspended'];

  useEffect(() => {
    if (item) {
      setFormData({
        employee_id: item.employee_id || '',
        license_number: item.license_number || '',
        experience_years: item.experience_years || '',
        status: item.status || 'Active',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Employee ID is required';
    if (!formData.license_number.trim()) newErrors.license_number = 'License number is required';
    if (!formData.experience_years) newErrors.experience_years = 'Experience years is required';
    
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
        employee_id: parseInt(formData.employee_id),
        license_number: formData.license_number,
        experience_years: parseInt(formData.experience_years),
        status: formData.status,
      };

      if (item) {
        await driversAPI.update(item.driver_id, submitData);
      } else {
        await driversAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving driver:', error);
      alert('Error saving driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <UserCircle size={24} />
            <h2>{item ? 'Edit Driver' : 'Add New Driver'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="employee_id">Employee ID *</label>
              <input
                id="employee_id"
                name="employee_id"
                type="number"
                value={formData.employee_id}
                onChange={handleChange}
                className={errors.employee_id ? 'error' : ''}
                placeholder="Enter Employee ID"
              />
              {errors.employee_id && <span className="error-text">{errors.employee_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="license_number">License Number *</label>
                <input
                  id="license_number"
                  name="license_number"
                  type="text"
                  value={formData.license_number}
                  onChange={handleChange}
                  className={errors.license_number ? 'error' : ''}
                  placeholder="CDL-123456"
                />
                {errors.license_number && <span className="error-text">{errors.license_number}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="experience_years">Experience (Years) *</label>
                <input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  min="0"
                  value={formData.experience_years}
                  onChange={handleChange}
                  className={errors.experience_years ? 'error' : ''}
                  placeholder="5"
                />
                {errors.experience_years && <span className="error-text">{errors.experience_years}</span>}
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

export default DriverForm;