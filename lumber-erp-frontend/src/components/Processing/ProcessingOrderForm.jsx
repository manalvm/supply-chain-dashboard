import React, { useState, useEffect } from 'react';
import { X, Save, Clipboard } from 'lucide-react';
import { processingOrdersAPI, productTypesAPI, processingUnitsAPI } from '../../services/api';

const ProcessingOrderForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    product_type_id: '',
    unit_id: '',
    start_date: '',
    end_date: '',
    output_quantity: '',
    efficiency_rate: '',
  });
  const [productTypes, setProductTypes] = useState([]);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    if (item) {
      setFormData({
        product_type_id: item.product_type_id || '',
        unit_id: item.unit_id || '',
        start_date: item.start_date ? item.start_date.split('T')[0] : '',
        end_date: item.end_date ? item.end_date.split('T')[0] : '',
        output_quantity: item.output_quantity || '',
        efficiency_rate: item.efficiency_rate || '',
      });
    } else {
      setFormData(prev => ({ ...prev, start_date: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchData = async () => {
    try {
      const [ptRes, unitRes] = await Promise.all([
        productTypesAPI.getAll(),
        processingUnitsAPI.getAll(),
      ]);
      setProductTypes(ptRes.data);
      setUnits(unitRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_type_id) newErrors.product_type_id = 'Product type is required';
    if (!formData.unit_id) newErrors.unit_id = 'Processing unit is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.output_quantity) newErrors.output_quantity = 'Output quantity is required';
    
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
        product_type_id: parseInt(formData.product_type_id),
        unit_id: parseInt(formData.unit_id),
        output_quantity: parseFloat(formData.output_quantity),
        efficiency_rate: parseFloat(formData.efficiency_rate) || null,
      };

      if (item) {
        await processingOrdersAPI.update(item.processing_id, submitData);
      } else {
        await processingOrdersAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving processing order:', error);
      alert('Error saving processing order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Clipboard size={24} />
            <h2>{item ? 'Edit Processing Order' : 'Create Processing Order'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="product_type_id">Product Type *</label>
              <select
                id="product_type_id"
                name="product_type_id"
                value={formData.product_type_id}
                onChange={handleChange}
                className={errors.product_type_id ? 'error' : ''}
              >
                <option value="">Select Product Type</option>
                {productTypes.map(pt => (
                  <option key={pt.product_type_id} value={pt.product_type_id}>
                    {pt.product_name} - {pt.category}
                  </option>
                ))}
              </select>
              {errors.product_type_id && <span className="error-text">{errors.product_type_id}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="unit_id">Processing Unit *</label>
              <select
                id="unit_id"
                name="unit_id"
                value={formData.unit_id}
                onChange={handleChange}
                className={errors.unit_id ? 'error' : ''}
              >
                <option value="">Select Processing Unit</option>
                {units.map(unit => (
                  <option key={unit.unit_id} value={unit.unit_id}>
                    Unit #{unit.unit_id} - {unit.cutting}
                  </option>
                ))}
              </select>
              {errors.unit_id && <span className="error-text">{errors.unit_id}</span>}
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
                <label htmlFor="end_date">End Date</label>
                <input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="output_quantity">Output Quantity *</label>
                <input
                  id="output_quantity"
                  name="output_quantity"
                  type="number"
                  step="0.01"
                  value={formData.output_quantity}
                  onChange={handleChange}
                  className={errors.output_quantity ? 'error' : ''}
                />
                {errors.output_quantity && <span className="error-text">{errors.output_quantity}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="efficiency_rate">Efficiency Rate (%)</label>
                <input
                  id="efficiency_rate"
                  name="efficiency_rate"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.efficiency_rate}
                  onChange={handleChange}
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

export default ProcessingOrderForm;