import React, { useState, useEffect } from 'react';
import { X, Save, Box } from 'lucide-react';
import { productTypesAPI } from '../../services/api';

const ProductTypeForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    unit_price: '',
    unit_of_measure: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = ['Lumber', 'Plywood', 'Beams', 'Planks', 'Veneer', 'Chips', 'Other'];
  const units = ['Board Feet', 'Cubic Meter', 'Linear Feet', 'Square Feet', 'Pieces', 'Tons'];

  useEffect(() => {
    if (item) {
      setFormData({
        product_name: item.product_name || '',
        category: item.category || '',
        unit_price: item.unit_price || '',
        unit_of_measure: item.unit_of_measure || '',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.product_name.trim()) newErrors.product_name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.unit_price) newErrors.unit_price = 'Unit price is required';
    if (!formData.unit_of_measure) newErrors.unit_of_measure = 'Unit of measure is required';
    
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
        unit_price: parseFloat(formData.unit_price),
      };

      if (item) {
        await productTypesAPI.update(item.product_type_id, submitData);
      } else {
        await productTypesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving product type:', error);
      alert('Error saving product type. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Box size={24} />
            <h2>{item ? 'Edit Product Type' : 'Add Product Type'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="product_name">Product Name *</label>
              <input
                id="product_name"
                name="product_name"
                type="text"
                value={formData.product_name}
                onChange={handleChange}
                className={errors.product_name ? 'error' : ''}
                placeholder="Douglas Fir 2x4"
              />
              {errors.product_name && <span className="error-text">{errors.product_name}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="unit_of_measure">Unit of Measure *</label>
                <select
                  id="unit_of_measure"
                  name="unit_of_measure"
                  value={formData.unit_of_measure}
                  onChange={handleChange}
                  className={errors.unit_of_measure ? 'error' : ''}
                >
                  <option value="">Select Unit</option>
                  {units.map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
                {errors.unit_of_measure && <span className="error-text">{errors.unit_of_measure}</span>}
              </div>
            </div>

            <div className="input-group">
              <label htmlFor="unit_price">Unit Price ($) *</label>
              <input
                id="unit_price"
                name="unit_price"
                type="number"
                step="0.01"
                value={formData.unit_price}
                onChange={handleChange}
                className={errors.unit_price ? 'error' : ''}
              />
              {errors.unit_price && <span className="error-text">{errors.unit_price}</span>}
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

export default ProductTypeForm;