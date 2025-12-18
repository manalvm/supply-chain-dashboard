import React, { useState, useEffect } from 'react';
import { X, Save, Trash2 } from 'lucide-react';
import { wasteRecordsAPI, processingOrdersAPI } from '../../services/api';

const WasteRecordForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    processing_id: '',
    waste_type: '',
    volume: '',
    disposal_method: '',
    recycled: false,
  });
  const [processingOrders, setProcessingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const wasteTypes = ['Sawdust', 'Wood Chips', 'Bark', 'Off-cuts', 'Shavings', 'Other'];
  const disposalMethods = ['Biomass Energy', 'Mulch Production', 'Composting', 'Landfill', 'Recycling', 'Pellets'];

  useEffect(() => {
    fetchProcessingOrders();
    if (item) {
      setFormData({
        processing_id: item.processing_id || '',
        waste_type: item.waste_type || '',
        volume: item.volume || '',
        disposal_method: item.disposal_method || '',
        recycled: item.recycled || false,
      });
    }
  }, [item]);

  const fetchProcessingOrders = async () => {
    try {
      const response = await processingOrdersAPI.getAll();
      setProcessingOrders(response.data);
    } catch (error) {
      console.error('Error fetching processing orders:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.processing_id) newErrors.processing_id = 'Processing order is required';
    if (!formData.waste_type) newErrors.waste_type = 'Waste type is required';
    if (!formData.volume) newErrors.volume = 'Volume is required';
    if (!formData.disposal_method) newErrors.disposal_method = 'Disposal method is required';
    
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
        ...formData,
        processing_id: parseInt(formData.processing_id),
        volume: parseFloat(formData.volume),
      };

      if (item) {
        await wasteRecordsAPI.update(item.waste_id, submitData);
      } else {
        await wasteRecordsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving waste record:', error);
      alert('Error saving waste record. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Trash2 size={24} />
            <h2>{item ? 'Edit Waste Record' : 'Add Waste Record'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="processing_id">Processing Order *</label>
              <select
                id="processing_id"
                name="processing_id"
                value={formData.processing_id}
                onChange={handleChange}
                className={errors.processing_id ? 'error' : ''}
              >
                <option value="">Select Processing Order</option>
                {processingOrders.map(order => (
                  <option key={order.processing_id} value={order.processing_id}>
                    Order #{order.processing_id}
                  </option>
                ))}
              </select>
              {errors.processing_id && <span className="error-text">{errors.processing_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="waste_type">Waste Type *</label>
                <select
                  id="waste_type"
                  name="waste_type"
                  value={formData.waste_type}
                  onChange={handleChange}
                  className={errors.waste_type ? 'error' : ''}
                >
                  <option value="">Select Type</option>
                  {wasteTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.waste_type && <span className="error-text">{errors.waste_type}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="volume">Volume (units) *</label>
                <input
                  id="volume"
                  name="volume"
                  type="number"
                  step="0.01"
                  value={formData.volume}
                  onChange={handleChange}
                  className={errors.volume ? 'error' : ''}
                />
                {errors.volume && <span className="error-text">{errors.volume}</span>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="disposal_method">Disposal Method *</label>
              <select
                id="disposal_method"
                name="disposal_method"
                value={formData.disposal_method}
                onChange={handleChange}
                className={errors.disposal_method ? 'error' : ''}
              >
                <option value="">Select Method</option>
                {disposalMethods.map(method => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </select>
              {errors.disposal_method && <span className="error-text">{errors.disposal_method}</span>}
            </div>

            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="recycled"
                  checked={formData.recycled}
                  onChange={handleChange}
                />
                <span>Waste Recycled</span>
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

export default WasteRecordForm;