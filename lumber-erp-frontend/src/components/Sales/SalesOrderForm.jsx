import React, { useState, useEffect } from 'react';
import { X, Save, ShoppingBag } from 'lucide-react';
import { salesOrdersAPI, customersAPI } from '../../services/api';

const SalesOrderForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    customer_id: '',
    order_date: '',
    delivery_date: '',
    total_amount: '',
    order_status: 'Pending',
  });
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchCustomers();
    if (item) {
      setFormData({
        employee_id: item.employee_id || '',
        customer_id: item.customer_id || '',
        order_date: item.order_date ? item.order_date.split('T')[0] : '',
        delivery_date: item.delivery_date ? item.delivery_date.split('T')[0] : '',
        total_amount: item.total_amount || '',
        order_status: item.status || 'Pending', // Backend returns 'status'
      });
    } else {
      setFormData(prev => ({ 
        ...prev, 
        order_date: new Date().toISOString().split('T')[0],
        employee_id: '1' // Default employee ID
      }));
    }
  }, [item]);

  const fetchCustomers = async () => {
    try {
      const response = await customersAPI.getAll();
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    if (!formData.customer_id) newErrors.customer_id = 'Customer is required';
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
      // Map frontend fields to backend expected fields
      const submitData = {
        employee_id: parseInt(formData.employee_id),
        customer_id: parseInt(formData.customer_id),
        order_date: formData.order_date,
        delivery_date: formData.delivery_date || null, // Send null if empty
        status: formData.order_status, // Backend expects 'status'
        total_amount: parseFloat(formData.total_amount),
      };

      if (item) {
        await salesOrdersAPI.update(item.soid, submitData); // Backend returns 'soid'
      } else {
        await salesOrdersAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving sales order:', error);
      alert('Error saving sales order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <ShoppingBag size={24} />
            <h2>{item ? 'Edit Sales Order' : 'Create Sales Order'}</h2>
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
              <label htmlFor="customer_id">Customer *</label>
              <select
                id="customer_id"
                name="customer_id"
                value={formData.customer_id}
                onChange={handleChange}
                className={errors.customer_id ? 'error' : ''}
              >
                <option value="">Select Customer</option>
                {customers.map(customer => (
                  <option key={customer.customer_id} value={customer.customer_id}>
                    {customer.name} {/* Backend returns 'name', not 'company_name' */}
                  </option>
                ))}
              </select>
              {errors.customer_id && <span className="error-text">{errors.customer_id}</span>}
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
                <label htmlFor="delivery_date">Delivery Date</label>
                <input
                  id="delivery_date"
                  name="delivery_date"
                  type="date"
                  value={formData.delivery_date}
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
                <label htmlFor="order_status">Status</label>
                <select
                  id="order_status"
                  name="order_status"
                  value={formData.order_status}
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

export default SalesOrderForm;