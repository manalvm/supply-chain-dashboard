import React, { useState, useEffect } from 'react';
import { X, Save, ArrowRightLeft } from 'lucide-react';
import { inventoryTransactionsAPI, stockItemsAPI } from '../../services/api';

const InventoryTransactionForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    stock_id: '',
    transaction_type: 'IN',
    quantity: '',
    transaction_date: '',
    reference_id: '',
  });
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const transactionTypes = ['IN', 'OUT', 'TRANSFER', 'ADJUSTMENT'];

  useEffect(() => {
    fetchStockItems();
    if (item) {
      setFormData({
        stock_id: item.stock_id || '',
        transaction_type: item.transaction_type || 'IN',
        quantity: item.quantity || '',
        transaction_date: item.transaction_date ? item.transaction_date.split('T')[0] : '',
        reference_id: item.reference_id || '',
      });
    } else {
      setFormData(prev => ({ ...prev, transaction_date: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchStockItems = async () => {
    try {
      const response = await stockItemsAPI.getAll();
      setStockItems(response.data || []);
    } catch (error) {
      console.error('Error fetching stock items:', error);
      setStockItems([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.stock_id) newErrors.stock_id = 'Stock item is required';
    if (!formData.quantity) newErrors.quantity = 'Quantity is required';
    if (!formData.transaction_date) newErrors.transaction_date = 'Transaction date is required';
    
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
        stock_id: parseInt(formData.stock_id),
        transaction_type: formData.transaction_type,
        quantity: parseFloat(formData.quantity),
        transaction_date: formData.transaction_date,
        reference_id: formData.reference_id,
      };

      console.log('Submitting data:', submitData);

      if (item) {
        await inventoryTransactionsAPI.update(item.transaction_id, submitData);
      } else {
        await inventoryTransactionsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving transaction:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error saving transaction: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <ArrowRightLeft size={24} />
            <h2>{item ? 'Edit Transaction' : 'New Transaction'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="stock_id">Stock Item *</label>
              <select
                id="stock_id"
                name="stock_id"
                value={formData.stock_id}
                onChange={handleChange}
                className={errors.stock_id ? 'error' : ''}
              >
                <option value="">Select Stock Item</option>
                {stockItems.map(item => (
                  <option key={item.stock_id} value={item.stock_id}>
                    Stock #{item.stock_id} - Qty: {item.quantity_in_stock}
                  </option>
                ))}
              </select>
              {errors.stock_id && <span className="error-text">{errors.stock_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="transaction_type">Transaction Type</label>
                <select
                  id="transaction_type"
                  name="transaction_type"
                  value={formData.transaction_type}
                  onChange={handleChange}
                >
                  {transactionTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={handleChange}
                  className={errors.quantity ? 'error' : ''}
                />
                {errors.quantity && <span className="error-text">{errors.quantity}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="transaction_date">Transaction Date *</label>
                <input
                  id="transaction_date"
                  name="transaction_date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={handleChange}
                  className={errors.transaction_date ? 'error' : ''}
                />
                {errors.transaction_date && <span className="error-text">{errors.transaction_date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="reference_id">Reference ID</label>
                <input
                  id="reference_id"
                  name="reference_id"
                  type="text"
                  value={formData.reference_id}
                  onChange={handleChange}
                  placeholder="PO-001, SO-002, etc."
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

export default InventoryTransactionForm;