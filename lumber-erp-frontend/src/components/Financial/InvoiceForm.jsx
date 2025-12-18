import React, { useState, useEffect } from 'react';
import { X, Save, FileText } from 'lucide-react';
import { invoicesAPI, salesOrdersAPI } from '../../services/api';

const InvoiceForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    so_id: '',
    issue_date: '',
    due_date: '',
    total_amount: '',
    tax: '',
    currency: 'USD',
    payment_status: 'Unpaid',
  });
  const [salesOrders, setSalesOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Unpaid', 'Partially Paid', 'Paid', 'Overdue'];
  const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

  useEffect(() => {
    fetchSalesOrders();
    if (item) {
      setFormData({
        so_id: item.soid || '', // Backend returns 'soid'
        issue_date: item.invoice_date ? item.invoice_date.split('T')[0] : '', // Backend returns 'invoice_date'
        due_date: item.due_date ? item.due_date.split('T')[0] : '',
        total_amount: item.total_amount || '',
        tax: item.tax || '0',
        currency: item.currency || 'USD',
        payment_status: item.status || 'Unpaid', // Backend returns 'status'
      });
    } else {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + 30);
      setFormData(prev => ({ 
        ...prev, 
        issue_date: today.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        tax: '0',
        currency: 'USD'
      }));
    }
  }, [item]);

  const fetchSalesOrders = async () => {
    try {
      const response = await salesOrdersAPI.getAll();
      setSalesOrders(response.data);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.so_id) newErrors.so_id = 'Sales order is required';
    if (!formData.issue_date) newErrors.issue_date = 'Issue date is required';
    if (!formData.due_date) newErrors.due_date = 'Due date is required';
    if (!formData.total_amount) newErrors.total_amount = 'Total amount is required';
    
    if (formData.issue_date && formData.due_date && 
        new Date(formData.due_date) < new Date(formData.issue_date)) {
      newErrors.due_date = 'Due date must be after issue date';
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
      // Map frontend fields to backend expected fields
      const submitData = {
        soid: parseInt(formData.so_id), // Backend expects 'soid'
        invoice_date: formData.issue_date, // Backend expects 'invoice_date'
        due_date: formData.due_date,
        total_amount: parseFloat(formData.total_amount),
        tax: parseFloat(formData.tax) || 0, // Backend expects 'tax'
        currency: formData.currency, // Backend expects 'currency'
        status: formData.payment_status, // Backend expects 'status'
      };

      if (item) {
        await invoicesAPI.update(item.invoice_id, submitData);
      } else {
        await invoicesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Error saving invoice. Please try again.');
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
            <h2>{item ? 'Edit Invoice' : 'Create Invoice'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="so_id">Sales Order *</label>
              <select
                id="so_id"
                name="so_id"
                value={formData.so_id}
                onChange={handleChange}
                className={errors.so_id ? 'error' : ''}
              >
                <option value="">Select Sales Order</option>
                {salesOrders.map(so => (
                  <option key={so.soid} value={so.soid}>
                    SO #{so.soid} - ${so.total_amount}
                  </option>
                ))}
              </select>
              {errors.so_id && <span className="error-text">{errors.so_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="issue_date">Issue Date *</label>
                <input
                  id="issue_date"
                  name="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  className={errors.issue_date ? 'error' : ''}
                />
                {errors.issue_date && <span className="error-text">{errors.issue_date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="due_date">Due Date *</label>
                <input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={handleChange}
                  className={errors.due_date ? 'error' : ''}
                />
                {errors.due_date && <span className="error-text">{errors.due_date}</span>}
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
                <label htmlFor="tax">Tax ($)</label>
                <input
                  id="tax"
                  name="tax"
                  type="number"
                  step="0.01"
                  value={formData.tax}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="currency">Currency</label>
                <select
                  id="currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  {currencies.map(curr => (
                    <option key={curr} value={curr}>{curr}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="payment_status">Payment Status</label>
                <select
                  id="payment_status"
                  name="payment_status"
                  value={formData.payment_status}
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

export default InvoiceForm;