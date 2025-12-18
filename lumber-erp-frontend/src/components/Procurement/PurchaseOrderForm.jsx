import React, { useState, useEffect } from 'react';
import { X, Save, ShoppingCart } from 'lucide-react';
import { purchaseOrdersAPI, suppliersAPI } from '../../services/api';

const PurchaseOrderForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    supplier_id: '',
    order_date: '',
    expected_delivery_date: '',
    total_amount: '',
    status: 'Pending',
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Pending', 'Approved', 'Received', 'Cancelled'];

  useEffect(() => {
    fetchSuppliers();
    if (item) {
      setFormData({
        employee_id: item.employee_id || '',
        supplier_id: item.supplier_id || '',
        order_date: item.order_date ? item.order_date.split('T')[0] : '',
        expected_delivery_date: item.expected_delivery_date ? item.expected_delivery_date.split('T')[0] : '',
        total_amount: item.total_amount || '',
        status: item.status || 'Pending',
      });
    } else {
      setFormData(prev => ({ 
        ...prev, 
        order_date: new Date().toISOString().split('T')[0]
      }));
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
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData.order_date) newErrors.order_date = 'Order date is required';
    if (!formData.total_amount) newErrors.total_amount = 'Total amount is required';
    
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
        supplier_id: parseInt(formData.supplier_id),
        order_date: formData.order_date,
        expected_delivery_date: formData.expected_delivery_date || null,
        status: formData.status,
        total_amount: parseFloat(formData.total_amount),
      };

      if (item) {
        await purchaseOrdersAPI.update(item.poid, submitData);
      } else {
        await purchaseOrdersAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving purchase order:', error);
      
      // Check for foreign key constraint errors
      let errorMessage = 'Error saving purchase order. Please try again.';
      
      if (error.response?.data?.error) {
        const backendError = error.response.data.error.toLowerCase();
        
        // Check if it's a foreign key constraint error
        if (backendError.includes('foreign key') || 
            backendError.includes('constraint') || 
            backendError.includes('violates') ||
            backendError.includes('employee')) {
          errorMessage = 'Employee not exist';
        } else if (backendError.includes('supplier')) {
          errorMessage = 'Supplier not exist';
        } else {
          errorMessage = error.response.data.error;
        }
      }
      
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <ShoppingCart size={24} />
            <h2>{item ? 'Edit Purchase Order' : 'Create Purchase Order'}</h2>
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
                    {supplier.company_name} - {supplier.contact_person}
                  </option>
                ))}
              </select>
              {errors.supplier_id && <span className="error-text">{errors.supplier_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="order_date">Order Date *</label>
                <input
                  id="order_date"
                  name="order_date"
                  type="date"
                  value={formData.order_date}
                  onChange={handleChange}
                  className={errors.order_date ? 'error' : ''}
                />
                {errors.order_date && <span className="error-text">{errors.order_date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="expected_delivery_date">Expected Delivery</label>
                <input
                  id="expected_delivery_date"
                  name="expected_delivery_date"
                  type="date"
                  value={formData.expected_delivery_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="total_amount">Total Amount ($) *</label>
                <input
                  id="total_amount"
                  name="total_amount"
                  type="number"
                  step="0.01"
                  value={formData.total_amount}
                  onChange={handleChange}
                  className={errors.total_amount ? 'error' : ''}
                />
                {errors.total_amount && <span className="error-text">{errors.total_amount}</span>}
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

export default PurchaseOrderForm;