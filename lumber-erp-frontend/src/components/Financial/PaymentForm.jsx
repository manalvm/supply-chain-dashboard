import React, { useState, useEffect } from 'react';
import { X, Save, CreditCard } from 'lucide-react';
import { paymentsAPI, invoicesAPI } from '../../services/api';

const PaymentForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    invoice_id: '',
    payment_date: '',
    amount_paid: '',
    payment_method: 'Bank Transfer',
    transaction_reference: '',
    status: 'Completed',
  });
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const paymentMethods = [
    'Bank Transfer',
    'Credit Card',
    'Debit Card',
    'Cash',
    'Check',
    'Wire Transfer',
    'PayPal',
    'Other'
  ];

  const statuses = ['Completed', 'Pending', 'Failed', 'Refunded'];

  useEffect(() => {
    fetchInvoices();
    if (item) {
      setFormData({
        invoice_id: item.invoice_id || '',
        payment_date: item.payment_date ? item.payment_date.split('T')[0] : '',
        amount_paid: item.amount || '', // Backend returns 'amount'
        payment_method: item.method || 'Bank Transfer', // Backend returns 'method'
        transaction_reference: item.reference_no || '', // Backend returns 'reference_no'
        status: item.status || 'Completed',
      });
    } else {
      setFormData(prev => ({ 
        ...prev, 
        payment_date: new Date().toISOString().split('T')[0],
        transaction_reference: `TXN-${Date.now()}`,
        status: 'Completed'
      }));
    }
  }, [item]);

  const fetchInvoices = async () => {
    try {
      const response = await invoicesAPI.getAll();
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.invoice_id) newErrors.invoice_id = 'Invoice is required';
    if (!formData.payment_date) newErrors.payment_date = 'Payment date is required';
    if (!formData.amount_paid) newErrors.amount_paid = 'Amount is required';
    
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
        invoice_id: parseInt(formData.invoice_id),
        payment_date: formData.payment_date,
        amount: parseFloat(formData.amount_paid), // Backend expects 'amount'
        method: formData.payment_method, // Backend expects 'method'
        reference_no: formData.transaction_reference, // Backend expects 'reference_no'
        status: formData.status, // Backend expects 'status'
      };

      if (item) {
        await paymentsAPI.update(item.payment_id, submitData);
      } else {
        await paymentsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving payment:', error);
      alert('Error saving payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <CreditCard size={24} />
            <h2>{item ? 'Edit Payment' : 'Record Payment'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="invoice_id">Invoice *</label>
              <select
                id="invoice_id"
                name="invoice_id"
                value={formData.invoice_id}
                onChange={handleChange}
                className={errors.invoice_id ? 'error' : ''}
              >
                <option value="">Select Invoice</option>
                {invoices.map(invoice => (
                  <option key={invoice.invoice_id} value={invoice.invoice_id}>
                    Invoice #{invoice.invoice_id} - ${invoice.total_amount} ({invoice.status})
                  </option>
                ))}
              </select>
              {errors.invoice_id && <span className="error-text">{errors.invoice_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="payment_date">Payment Date *</label>
                <input
                  id="payment_date"
                  name="payment_date"
                  type="date"
                  value={formData.payment_date}
                  onChange={handleChange}
                  className={errors.payment_date ? 'error' : ''}
                />
                {errors.payment_date && <span className="error-text">{errors.payment_date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="amount_paid">Amount Paid ($) *</label>
                <input
                  id="amount_paid"
                  name="amount_paid"
                  type="number"
                  step="0.01"
                  value={formData.amount_paid}
                  onChange={handleChange}
                  className={errors.amount_paid ? 'error' : ''}
                />
                {errors.amount_paid && <span className="error-text">{errors.amount_paid}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="payment_method">Payment Method</label>
                <select
                  id="payment_method"
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleChange}
                >
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
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

            <div className="input-group">
              <label htmlFor="transaction_reference">Transaction Reference</label>
              <input
                id="transaction_reference"
                name="transaction_reference"
                type="text"
                value={formData.transaction_reference}
                onChange={handleChange}
                placeholder="TXN-12345"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : item ? 'Update' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;