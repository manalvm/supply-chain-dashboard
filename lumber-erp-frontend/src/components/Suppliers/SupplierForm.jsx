import React, { useState, useEffect } from 'react';
import { X, Save, Building } from 'lucide-react';
import { suppliersAPI } from '../../services/api';

const SupplierForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    compliance_status: 'Pending',
    raw: false,
    semi_processed: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        company_name: item.company_name || '',
        contact_person: item.contact_person || '',
        email: item.email || '',
        phone: item.phone || '',
        compliance_status: item.compliance_status || 'Pending',
        raw: item.raw || false,
        semi_processed: item.semi_processed || false,
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required';
    if (!formData.contact_person.trim()) newErrors.contact_person = 'Contact person is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    
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
      if (item) {
        await suppliersAPI.update(item.supplier_id, formData);
      } else {
        await suppliersAPI.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving supplier:', error);
      alert('Error saving supplier. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Building size={24} />
            <h2>{item ? 'Edit Supplier' : 'Add New Supplier'}</h2>
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
              />
              {errors.company_name && <span className="error-text">{errors.company_name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="contact_person">Contact Person *</label>
              <input
                id="contact_person"
                name="contact_person"
                type="text"
                value={formData.contact_person}
                onChange={handleChange}
                className={errors.contact_person ? 'error' : ''}
              />
              {errors.contact_person && <span className="error-text">{errors.contact_person}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="compliance_status">Compliance Status</label>
              <select
                id="compliance_status"
                name="compliance_status"
                value={formData.compliance_status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="Certified">Certified</option>
                <option value="Premium Certified">Premium Certified</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="raw"
                  checked={formData.raw}
                  onChange={handleChange}
                />
                <span>Supplies Raw Materials</span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="semi_processed"
                  checked={formData.semi_processed}
                  onChange={handleChange}
                />
                <span>Supplies Semi-Processed Materials</span>
              </label>
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

export default SupplierForm;