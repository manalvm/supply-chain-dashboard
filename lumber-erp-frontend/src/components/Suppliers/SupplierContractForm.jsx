import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { supplierContractsAPI, suppliersAPI } from '../../services/api';

const SupplierContractForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    supplier_id: '',
    start_date: '',
    end_date: '',
    terms: '',
    contract_value: '',
    status: 'Active',
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Active', 'Expired', 'Terminated', 'Under Review'];

  useEffect(() => {
    fetchSuppliers();
    if (item) {
      setFormData({
        supplier_id: item.supplier_id || '',
        start_date: item.start_date ? item.start_date.split('T')[0] : '',
        end_date: item.end_date ? item.end_date.split('T')[0] : '',
        terms: item.terms || '',
        contract_value: item.contract_value || '',
        status: item.status || 'Active',
      });
    }
  }, [item]);

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    if (!formData.contract_value) newErrors.contract_value = 'Contract value is required';
    
    if (formData.start_date && formData.end_date && 
        new Date(formData.end_date) < new Date(formData.start_date)) {
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
        supplier_id: parseInt(formData.supplier_id),
        contract_value: parseFloat(formData.contract_value),
      };

      if (item) {
        await supplierContractsAPI.update(item.contract_id, submitData);
      } else {
        await supplierContractsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving contract:', error);
      alert('Error saving contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <FileText size={24} />
            <h2>{item ? 'Edit Contract' : 'Create Contract'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="supplier_id">Supplier *</label>
              <select
                id="supplier_id"
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                className={errors.supplier_id ? 'error' : ''}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.company_name}
                  </option>
                ))}
              </select>
              {errors.supplier_id && <span className="error-text">{errors.supplier_id}</span>}
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
              <label htmlFor="terms">Contract Terms</label>
              <textarea
                id="terms"
                name="terms"
                rows="4"
                value={formData.terms}
                onChange={handleChange}
                placeholder="Annual contract with quarterly reviews. 30-day payment terms."
              />
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="contract_value">Contract Value ($) *</label>
                <input
                  id="contract_value"
                  name="contract_value"
                  type="number"
                  step="0.01"
                  value={formData.contract_value}
                  onChange={handleChange}
                  className={errors.contract_value ? 'error' : ''}
                />
                {errors.contract_value && <span className="error-text">{errors.contract_value}</span>}
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

export default SupplierContractForm;