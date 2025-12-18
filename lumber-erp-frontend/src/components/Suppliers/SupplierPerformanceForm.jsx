import React, { useState, useEffect } from 'react';
import { X, Save, TrendingUp } from 'lucide-react';
import { supplierPerformanceAPI, suppliersAPI } from '../../services/api';

const SupplierPerformanceForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    supplier_id: '',
    rating: '',
    delivery_timeliness: '',
    quality_score: '',
    review_date: '',
  });
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSuppliers();
    if (item) {
      setFormData({
        supplier_id: item.supplier_id || '',
        rating: item.rating || '',
        delivery_timeliness: item.delivery_timeliness || '',
        quality_score: item.quality_score || '',
        review_date: item.review_date ? item.review_date.split('T')[0] : '',
      });
    } else {
      setFormData(prev => ({ ...prev, review_date: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchSuppliers = async () => {
    try {
      const response = await suppliersAPI.getAll();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
    if (!formData.rating) newErrors.rating = 'Rating is required';
    if (!formData.review_date) newErrors.review_date = 'Review date is required';
    
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
        supplier_id: parseInt(formData.supplier_id),
        rating: parseFloat(formData.rating),
        delivery_timeliness: parseFloat(formData.delivery_timeliness) || null,
        quality_score: parseFloat(formData.quality_score) || null,
      };

      if (item) {
        await supplierPerformanceAPI.update(item.performance_id, submitData);
      } else {
        await supplierPerformanceAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving performance:', error);
      alert('Error saving performance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <TrendingUp size={24} />
            <h2>{item ? 'Edit Performance' : 'Add Performance Review'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="supplier_id">Supplier *</label>
              <select
                id="supplier_id"
                name="supplier_id"
                value={formData.supplier_id}
                onChange={handleChange}
                className={errors.supplier_id ? 'error' : ''}
              >
                <option value="">Select Supplier</option>
                {suppliers.map(supplier => (
                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                    {supplier.company_name}
                  </option>
                ))}
              </select>
              {errors.supplier_id && <span className="error-text">{errors.supplier_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="rating">Overall Rating (0-5) *</label>
                <input
                  id="rating"
                  name="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.rating}
                  onChange={handleChange}
                  className={errors.rating ? 'error' : ''}
                />
                {errors.rating && <span className="error-text">{errors.rating}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="review_date">Review Date *</label>
                <input
                  id="review_date"
                  name="review_date"
                  type="date"
                  value={formData.review_date}
                  onChange={handleChange}
                  className={errors.review_date ? 'error' : ''}
                />
                {errors.review_date && <span className="error-text">{errors.review_date}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="delivery_timeliness">Delivery Timeliness (%)</label>
                <input
                  id="delivery_timeliness"
                  name="delivery_timeliness"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.delivery_timeliness}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="quality_score">Quality Score (%)</label>
                <input
                  id="quality_score"
                  name="quality_score"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.quality_score}
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

export default SupplierPerformanceForm;