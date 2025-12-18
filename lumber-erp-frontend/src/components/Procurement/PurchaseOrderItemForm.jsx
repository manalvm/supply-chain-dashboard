import React, { useState, useEffect } from 'react';
import { X, Save, List } from 'lucide-react';
import { purchaseOrderItemsAPI, purchaseOrdersAPI, productTypesAPI } from '../../services/api';

const PurchaseOrderItemForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    po_id: '',
    product_type_id: '',
    quantity_ordered: '',
    unit_price: '',
  });
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    if (item) {
      setFormData({
        po_id: item.poid || '', // Backend returns 'poid'
        product_type_id: item.product_type_id || '',
        quantity_ordered: item.quantity || '', // Backend returns 'quantity'
        unit_price: item.unit_price || '',
      });
    }
  }, [item]);

  const fetchData = async () => {
    try {
      const [poRes, ptRes] = await Promise.all([
        purchaseOrdersAPI.getAll(),
        productTypesAPI.getAll(),
      ]);
      setPurchaseOrders(poRes.data);
      setProductTypes(ptRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.po_id) newErrors.po_id = 'Purchase order is required';
    if (!formData.product_type_id) newErrors.product_type_id = 'Product type is required';
    if (!formData.quantity_ordered) newErrors.quantity_ordered = 'Quantity is required';
    if (!formData.unit_price) newErrors.unit_price = 'Unit price is required';
    
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
      const quantity = parseFloat(formData.quantity_ordered);
      const unitPrice = parseFloat(formData.unit_price);
      const subtotal = quantity * unitPrice;

      // Map frontend fields to backend expected fields
      const submitData = {
        poid: parseInt(formData.po_id), // Backend expects 'poid'
        product_type_id: parseInt(formData.product_type_id),
        quantity: quantity, // Backend expects 'quantity'
        unit_price: unitPrice,
        subtotal: subtotal, // Backend expects 'subtotal'
      };

      if (item) {
        await purchaseOrderItemsAPI.update(item.po_item_id, submitData);
      } else {
        await purchaseOrderItemsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving PO item:', error);
      alert('Error saving PO item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    const qty = parseFloat(formData.quantity_ordered) || 0;
    const price = parseFloat(formData.unit_price) || 0;
    return (qty * price).toFixed(2);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <List size={24} />
            <h2>{item ? 'Edit PO Item' : 'Add PO Item'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="po_id">Purchase Order *</label>
              <select
                id="po_id"
                name="po_id"
                value={formData.po_id}
                onChange={handleChange}
                className={errors.po_id ? 'error' : ''}
              >
                <option value="">Select PO</option>
                {purchaseOrders.map(po => (
                  <option key={po.poid} value={po.poid}>
                    PO #{po.poid} - {po.status}
                  </option>
                ))}
              </select>
              {errors.po_id && <span className="error-text">{errors.po_id}</span>}
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
                <option value="">Select Product</option>
                {productTypes.map(pt => (
                  <option key={pt.product_type_id} value={pt.product_type_id}>
                    {pt.product_name} - ${pt.unit_price}
                  </option>
                ))}
              </select>
              {errors.product_type_id && <span className="error-text">{errors.product_type_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="quantity_ordered">Quantity *</label>
                <input
                  id="quantity_ordered"
                  name="quantity_ordered"
                  type="number"
                  step="0.01"
                  value={formData.quantity_ordered}
                  onChange={handleChange}
                  className={errors.quantity_ordered ? 'error' : ''}
                />
                {errors.quantity_ordered && <span className="error-text">{errors.quantity_ordered}</span>}
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

            {formData.quantity_ordered && formData.unit_price && (
              <div className="total-preview">
                <strong>Total:</strong> ${calculateTotal()}
              </div>
            )}
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

export default PurchaseOrderItemForm;