import React, { useState, useEffect } from 'react';
import { X, Save, AlertTriangle } from 'lucide-react';
import { stockAlertsAPI, stockItemsAPI } from '../../services/api';

const StockAlertForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    stock_id: '',
    alert_type: 'Low Stock',
    triggered_date: '',
    resolved: false,
  });
  const [stockItems, setStockItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const alertTypes = ['Low Stock', 'Out of Stock', 'Overstocked', 'Expiring Soon'];

  useEffect(() => {
    fetchStockItems();
    if (item) {
      setFormData({
        stock_id: item.stock_id || '',
        alert_type: item.alert_type || 'Low Stock',
        triggered_date: item.triggered_date ? item.triggered_date.split('T')[0] : '',
        resolved: item.resolved || false,
      });
    } else {
      setFormData(prev => ({ ...prev, triggered_date: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchStockItems = async () => {
    try {
      const response = await stockItemsAPI.getAll();
      setStockItems(response.data);
    } catch (error) {
      console.error('Error fetching stock items:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.stock_id) newErrors.stock_id = 'Stock item is required';
    if (!formData.triggered_date) newErrors.triggered_date = 'Triggered date is required';
    
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
      stock_id: parseInt(formData.stock_id),
      alert_type: formData.alert_type,
      triggered_date: formData.triggered_date,
      resolved: formData.resolved,
    };

    console.log('Submitting data:', submitData);

    if (item) {
      await stockAlertsAPI.update(item.alert_id, submitData);
    } else {
      await stockAlertsAPI.create(submitData);
    }
    onSuccess();
  } catch (error) {
    console.error('Error saving alert:', error);
    console.error('Error response:', error.response?.data);
    alert(`Error saving alert: ${error.response?.data?.error || error.message}`);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <AlertTriangle size={24} />
            <h2>{item ? 'Edit Stock Alert' : 'Create Stock Alert'}</h2>
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
                <label htmlFor="alert_type">Alert Type</label>
                <select
                  id="alert_type"
                  name="alert_type"
                  value={formData.alert_type}
                  onChange={handleChange}
                >
                  {alertTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label htmlFor="triggered_date">Triggered Date *</label>
                <input
                  id="triggered_date"
                  name="triggered_date"
                  type="date"
                  value={formData.triggered_date}
                  onChange={handleChange}
                  className={errors.triggered_date ? 'error' : ''}
                />
                {errors.triggered_date && <span className="error-text">{errors.triggered_date}</span>}
              </div>
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="resolved"
                  checked={formData.resolved}
                  onChange={handleChange}
                />
                <span>Alert Resolved</span>
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

export default StockAlertForm;