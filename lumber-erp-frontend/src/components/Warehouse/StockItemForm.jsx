import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { stockItemsAPI, warehousesAPI, productTypesAPI } from '../../services/api';

const StockItemForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    warehouse_id: '',
    product_type_id: '',
    quantity_in_stock: '',
    shelf_location: '',
    last_restocked: '',
  });
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    if (item) {
      setFormData({
        warehouse_id: item.warehouse_id || '',
        product_type_id: item.product_type_id || '',
        quantity_in_stock: item.quantity_in_stock || '',
        shelf_location: item.shelf_location || '',
        last_restocked: item.last_restocked ? item.last_restocked.split('T')[0] : '',
      });
    } else {
      setFormData(prev => ({ ...prev, last_restocked: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchData = async () => {
    try {
      const [whRes, ptRes] = await Promise.all([
        warehousesAPI.getAll(),
        productTypesAPI.getAll(),
      ]);
      setWarehouses(whRes.data || []);
      setProductTypes(ptRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.warehouse_id) newErrors.warehouse_id = 'Warehouse is required';
    if (!formData.product_type_id) newErrors.product_type_id = 'Product type is required';
    if (!formData.quantity_in_stock) newErrors.quantity_in_stock = 'Quantity is required';
    
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
        warehouse_id: parseInt(formData.warehouse_id),
        product_type_id: parseInt(formData.product_type_id),
        quantity_in_stock: parseFloat(formData.quantity_in_stock),
        shelf_location: formData.shelf_location,
        last_restocked: formData.last_restocked,
      };

      console.log('Submitting data:', submitData);

      if (item) {
        await stockItemsAPI.update(item.stock_id, submitData);
      } else {
        await stockItemsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving stock item:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error saving stock item: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Package size={24} />
            <h2>{item ? 'Edit Stock Item' : 'Add Stock Item'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="warehouse_id">Warehouse *</label>
              <select
                id="warehouse_id"
                name="warehouse_id"
                value={formData.warehouse_id}
                onChange={handleChange}
                className={errors.warehouse_id ? 'error' : ''}
              >
                <option value="">Select Warehouse</option>
                {warehouses.map(wh => (
                  <option key={wh.warehouse_id} value={wh.warehouse_id}>
                    {wh.name} - {wh.location}
                  </option>
                ))}
              </select>
              {errors.warehouse_id && <span className="error-text">{errors.warehouse_id}</span>}
            </div>

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

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="quantity_in_stock">Quantity in Stock *</label>
                <input
                  id="quantity_in_stock"
                  name="quantity_in_stock"
                  type="number"
                  step="0.01"
                  value={formData.quantity_in_stock}
                  onChange={handleChange}
                  className={errors.quantity_in_stock ? 'error' : ''}
                />
                {errors.quantity_in_stock && <span className="error-text">{errors.quantity_in_stock}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="shelf_location">Shelf Location</label>
                <input
                  id="shelf_location"
                  name="shelf_location"
                  type="text"
                  value={formData.shelf_location}
                  onChange={handleChange}
                  placeholder="e.g., A-12-3"
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

export default StockItemForm;