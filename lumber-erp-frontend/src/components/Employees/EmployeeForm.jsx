import React, { useState, useEffect } from 'react';
import { X, Save, User } from 'lucide-react';
import { employeesAPI } from '../../services/api';

const EmployeeForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    department: '',
    position: '',
    hire_date: '',
    performance_rating: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const departments = [
    'Operations',
    'Quality Control',
    'Warehouse',
    'Sales',
    'Finance',
    'HR',
    'IT',
    'Management'
  ];

  useEffect(() => {
    if (item) {
      setFormData({
        full_name: item.full_name || '',
        department: item.department || '',
        position: item.position || '',
        hire_date: item.hire_date ? item.hire_date.split('T')[0] : '',
        performance_rating: item.performance_rating || '',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!formData.department) newErrors.department = 'Department is required';
    if (!formData.position.trim()) newErrors.position = 'Position is required';
    if (!formData.hire_date) newErrors.hire_date = 'Hire date is required';
    
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
        performance_rating: parseFloat(formData.performance_rating) || null,
      };

      if (item) {
        await employeesAPI.update(item.employee_id, submitData);
      } else {
        await employeesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Error saving employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <User size={24} />
            <h2>{item ? 'Edit Employee' : 'Add New Employee'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="full_name">Full Name *</label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className={errors.full_name ? 'error' : ''}
              />
              {errors.full_name && <span className="error-text">{errors.full_name}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="department">Department *</label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className={errors.department ? 'error' : ''}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && <span className="error-text">{errors.department}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="position">Position *</label>
                <input
                  id="position"
                  name="position"
                  type="text"
                  value={formData.position}
                  onChange={handleChange}
                  className={errors.position ? 'error' : ''}
                />
                {errors.position && <span className="error-text">{errors.position}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="hire_date">Hire Date *</label>
                <input
                  id="hire_date"
                  name="hire_date"
                  type="date"
                  value={formData.hire_date}
                  onChange={handleChange}
                  className={errors.hire_date ? 'error' : ''}
                />
                {errors.hire_date && <span className="error-text">{errors.hire_date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="performance_rating">Performance Rating (0-5)</label>
                <input
                  id="performance_rating"
                  name="performance_rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={formData.performance_rating}
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

export default EmployeeForm;