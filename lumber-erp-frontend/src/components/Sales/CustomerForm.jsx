import React, { useState, useEffect } from 'react';
import { X, Save, Users } from 'lucide-react';
import { customersAPI } from '../../services/api';

const CustomerForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    retailer: false,
    end_user: false,
    contact_info: '',
    address: '',
    tax_number: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        retailer: item.retailer || false,
        end_user: item.end_user || false,
        contact_info: item.contact_info || '',
        address: item.address || '',
        tax_number: item.tax_number || '',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.contact_info.trim()) newErrors.contact_info = 'Contact info is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
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
        name: formData.name,
        retailer: formData.retailer,
        end_user: formData.end_user,
        contact_info: formData.contact_info,
        address: formData.address,
        tax_number: formData.tax_number,
      };

      if (item) {
        await customersAPI.update(item.customer_id, submitData);
      } else {
        await customersAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Error saving customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Users size={24} />
            <h2>{item ? 'Edit Customer' : 'Add New Customer'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="name">Customer Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? 'error' : ''}
                placeholder="ABC Construction Co."
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    name="retailer"
                    checked={formData.retailer}
                    onChange={handleChange}
                  />
                  {' '}Retailer
                </label>
              </div>

              <div className="input-group">
                <label>
                  <input
                    type="checkbox"
                    name="end_user"
                    checked={formData.end_user}
                    onChange={handleChange}
                  />
                  {' '}End User
                </label>
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="contact_info">Contact Info *</label>
              <textarea
                id="contact_info"
                name="contact_info"
                rows="2"
                value={formData.contact_info}
                onChange={handleChange}
                className={errors.contact_info ? 'error' : ''}
                placeholder="Email: john@abc.com, Phone: +1-555-0123"
              />
              {errors.contact_info && <span className="error-text">{errors.contact_info}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="address">Address</label>
              <textarea
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main St, City, State, ZIP"
              />
            </div>

            <div className="input-group">
              <label htmlFor="tax_number">Tax Number</label>
              <input
                id="tax_number"
                name="tax_number"
                type="text"
                value={formData.tax_number}
                onChange={handleChange}
                placeholder="123-45-6789"
              />
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

export default CustomerForm;