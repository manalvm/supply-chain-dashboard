import React, { useState, useEffect } from 'react';
import { X, Save, ClipboardCheck } from 'lucide-react';
import { qualityInspectionsAPI, harvestBatchesAPI, employeesAPI } from '../../services/api';

const QualityInspectionForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    processing_id: '',
    po_item_id: '',
    batch_id: '',
    result: 'Pass',
    moisture_level: '',
    certification_id: '',
    date: '',
  });
  const [batches, setBatches] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchBatches();
    fetchEmployees();
    if (item) {
      setFormData({
        employee_id: item.employee_id || '',
        processing_id: item.processing_id || '',
        po_item_id: item.po_item_id || '',
        batch_id: item.batch_id || '',
        result: item.result || 'Pass',
        moisture_level: item.moisture_level || '',
        certification_id: item.certification_id || '',
        date: item.date ? item.date.split('T')[0] : '',
      });
    } else {
      setFormData(prev => ({ ...prev, date: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchBatches = async () => {
    try {
      const response = await harvestBatchesAPI.getAll();
      setBatches(response.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
      setBatches([]);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      setEmployees(response.data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
      setEmployees([]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    if (!formData.batch_id) newErrors.batch_id = 'Batch is required';
    if (!formData.date) newErrors.date = 'Inspection date is required';
    if (!formData.result) newErrors.result = 'Result is required';
    
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
        employee_id: parseInt(formData.employee_id),
        processing_id: formData.processing_id ? parseInt(formData.processing_id) : null,
        po_item_id: formData.po_item_id ? parseInt(formData.po_item_id) : null,
        batch_id: parseInt(formData.batch_id),
        result: formData.result,
        moisture_level: formData.moisture_level ? parseFloat(formData.moisture_level) : 0.0,
        certification_id: formData.certification_id || '',
        date: formData.date,
      };

      console.log('Submitting data:', submitData);

      if (item) {
        await qualityInspectionsAPI.update(item.inspection_id, submitData);
      } else {
        await qualityInspectionsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving inspection:', error);
      console.error('Error response:', error.response?.data);
      alert(`Error saving inspection: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <ClipboardCheck size={24} />
            <h2>{item ? 'Edit Inspection' : 'New Quality Inspection'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="employee_id">Inspector (Employee) *</label>
                <select
                  id="employee_id"
                  name="employee_id"
                  value={formData.employee_id}
                  onChange={handleChange}
                  className={errors.employee_id ? 'error' : ''}
                >
                  <option value="">Select Inspector</option>
                  {employees.map(emp => (
                    <option key={emp.employee_id} value={emp.employee_id}>
                      {emp.full_name} {emp.role ? `- ${emp.role}` : ''}
                    </option>
                  ))}
                </select>
                {errors.employee_id && <span className="error-text">{errors.employee_id}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="batch_id">Batch *</label>
                <select
                  id="batch_id"
                  name="batch_id"
                  value={formData.batch_id}
                  onChange={handleChange}
                  className={errors.batch_id ? 'error' : ''}
                >
                  <option value="">Select Batch</option>
                  {batches.map(batch => (
                    <option key={batch.batch_id} value={batch.batch_id}>
                      Batch #{batch.batch_id} {batch.qr_code ? `- ${batch.qr_code}` : ''}
                    </option>
                  ))}
                </select>
                {errors.batch_id && <span className="error-text">{errors.batch_id}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="date">Inspection Date *</label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'error' : ''}
                />
                {errors.date && <span className="error-text">{errors.date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="result">Result *</label>
                <select
                  id="result"
                  name="result"
                  value={formData.result}
                  onChange={handleChange}
                  className={errors.result ? 'error' : ''}
                >
                  <option value="Pass">Pass</option>
                  <option value="Fail">Fail</option>
                </select>
                {errors.result && <span className="error-text">{errors.result}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="moisture_level">Moisture Level (%)</label>
                <input
                  id="moisture_level"
                  name="moisture_level"
                  type="number"
                  step="0.01"
                  value={formData.moisture_level}
                  onChange={handleChange}
                  placeholder="e.g., 12.5"
                />
              </div>

              <div className="input-group">
                <label htmlFor="certification_id">Certification ID</label>
                <input
                  id="certification_id"
                  name="certification_id"
                  type="text"
                  value={formData.certification_id}
                  onChange={handleChange}
                  placeholder="e.g., FSC-C123456"
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="processing_id">Processing ID (Optional)</label>
                <input
                  id="processing_id"
                  name="processing_id"
                  type="number"
                  value={formData.processing_id}
                  onChange={handleChange}
                  placeholder="Processing ID"
                />
              </div>

              <div className="input-group">
                <label htmlFor="po_item_id">PO Item ID (Optional)</label>
                <input
                  id="po_item_id"
                  name="po_item_id"
                  type="number"
                  value={formData.po_item_id}
                  onChange={handleChange}
                  placeholder="PO Item ID"
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

export default QualityInspectionForm;