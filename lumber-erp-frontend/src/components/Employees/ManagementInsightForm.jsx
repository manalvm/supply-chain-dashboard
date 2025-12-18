import React, { useState, useEffect } from 'react';
import { X, Save, BarChart } from 'lucide-react';
import { managementInsightsAPI, employeesAPI } from '../../services/api';

const ManagementInsightForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    kpi_type: '',
    time_period: '',
  });
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const kpiTypes = [
    'Production Efficiency',
    'Sales Performance',
    'Quality Score',
    'Safety Record',
    'Customer Satisfaction',
    'Cost Management',
  ];

  useEffect(() => {
    fetchEmployees();
    if (item) {
      setFormData({
        employee_id: item.employee_id || '',
        kpi_type: item.kpi_type || '',
        time_period: item.time_period || '',
      });
    }
  }, [item]);

  const fetchEmployees = async () => {
    try {
      const response = await employeesAPI.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    if (!formData.kpi_type) newErrors.kpi_type = 'KPI type is required';
    if (!formData.time_period.trim()) newErrors.time_period = 'Time period is required';
    
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
        employee_id: parseInt(formData.employee_id),
      };

      if (item) {
        await managementInsightsAPI.update(item.report_id, submitData);
      } else {
        await managementInsightsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving insight:', error);
      alert('Error saving insight. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <BarChart size={24} />
            <h2>{item ? 'Edit Insight' : 'Create Insight'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="employee_id">Employee *</label>
              <select
                id="employee_id"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                className={errors.employee_id ? 'error' : ''}
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp.employee_id} value={emp.employee_id}>
                    {emp.full_name} - {emp.department}
                  </option>
                ))}
              </select>
              {errors.employee_id && <span className="error-text">{errors.employee_id}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="kpi_type">KPI Type *</label>
              <select
                id="kpi_type"
                name="kpi_type"
                value={formData.kpi_type}
                onChange={handleChange}
                className={errors.kpi_type ? 'error' : ''}
              >
                <option value="">Select KPI Type</option>
                {kpiTypes.map(kpi => (
                  <option key={kpi} value={kpi}>{kpi}</option>
                ))}
              </select>
              {errors.kpi_type && <span className="error-text">{errors.kpi_type}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="time_period">Time Period *</label>
              <input
                id="time_period"
                name="time_period"
                type="text"
                value={formData.time_period}
                onChange={handleChange}
                className={errors.time_period ? 'error' : ''}
                placeholder="e.g., Q1 2024, January 2024"
              />
              {errors.time_period && <span className="error-text">{errors.time_period}</span>}
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

export default ManagementInsightForm;