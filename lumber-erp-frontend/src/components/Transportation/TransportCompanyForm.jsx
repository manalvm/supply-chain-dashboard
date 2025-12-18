import React, { useState, useEffect } from 'react';
import { X, Save, Truck } from 'lucide-react';
import { transportCompaniesAPI } from '../../services/api';

const TransportCompanyForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_info: '',
    license_number: '',
    rating: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        company_name: item.company_name || '',
        contact_info: item.contact_info || '',
        license_number: item.license_number || '',
        rating: item.rating || '',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.contact_info.trim()) newErrors.contact_info = 'Contact info is required';
    if (!formData.license_number.trim()) newErrors.license_number = 'License number is required';
    
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
        company_name: formData.company_name,
        contact_info: formData.contact_info,
        license_number: formData.license_number,
        rating: parseFloat(formData.rating) || 0,
      };

      if (item) {
        await transportCompaniesAPI.update(item.company_id, submitData);
      } else {
        await transportCompaniesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving transport company:', error);
      alert('Error saving transport company. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Truck size={24} />
            <h2>{item ? 'Edit Transport Company' : 'Add Transport Company'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="company_name">Company Name *</label>
              <input
                id="company_name"
                name="company_name"
                type="text"
                value={formData.company_name}
                onChange={handleChange}
                className={errors.company_name ? 'error' : ''}
                placeholder="Fast Freight Logistics"
              />
              {errors.company_name && <span className="error-text">{errors.company_name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="contact_info">Contact Info *</label>
              <textarea
                id="contact_info"
                name="contact_info"
                rows="3"
                value={formData.contact_info}
                onChange={handleChange}
                className={errors.contact_info ? 'error' : ''}
                placeholder="Contact Person: John Dispatcher&#10;Email: contact@fastfreight.com&#10;Phone: +1-555-0123"
              />
              {errors.contact_info && <span className="error-text">{errors.contact_info}</span>}
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
                  placeholder="DOT-123456"
                />
                {errors.license_number && <span className="error-text">{errors.license_number}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="rating">Rating (0-5)</label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  placeholder="4.5"
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

export default TransportCompanyForm;