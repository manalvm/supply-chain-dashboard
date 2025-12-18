import React, { useState, useEffect } from 'react';
import { X, Save, Briefcase } from 'lucide-react';
import { workerAssignmentsAPI, employeesAPI, processingOrdersAPI } from '../../services/api';

const WorkerAssignmentForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    employee_id: '',
    processing_id: '',
    role_in_task: '',
    notes: '',
  });
  const [employees, setEmployees] = useState([]);
  const [processingOrders, setProcessingOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    if (item) {
      setFormData({
        employee_id: item.employee_id || '',
        processing_id: item.processing_id || '',
        role_in_task: item.role_in_task || '',
        notes: item.notes || '',
      });
    }
  }, [item]);

  const fetchData = async () => {
    try {
      const [empRes, procRes] = await Promise.all([
        employeesAPI.getAll(),
        processingOrdersAPI.getAll(),
      ]);
      setEmployees(empRes.data);
      setProcessingOrders(procRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.employee_id) newErrors.employee_id = 'Employee is required';
    if (!formData.processing_id) newErrors.processing_id = 'Processing order is required';
    if (!formData.role_in_task.trim()) newErrors.role_in_task = 'Role is required';
    
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
        processing_id: parseInt(formData.processing_id),
      };

      if (item) {
        await workerAssignmentsAPI.update(item.assignment_id, submitData);
      } else {
        await workerAssignmentsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving assignment:', error);
      alert('Error saving assignment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Briefcase size={24} />
            <h2>{item ? 'Edit Assignment' : 'Create Assignment'}</h2>
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
                    {emp.full_name} - {emp.position}
                  </option>
                ))}
              </select>
              {errors.employee_id && <span className="error-text">{errors.employee_id}</span>}
            </div>

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

            <div className="input-group">
              <label htmlFor="role_in_task">Role in Task *</label>
              <input
                id="role_in_task"
                name="role_in_task"
                type="text"
                value={formData.role_in_task}
                onChange={handleChange}
                className={errors.role_in_task ? 'error' : ''}
                placeholder="e.g., Lead Operator, Assistant"
              />
              {errors.role_in_task && <span className="error-text">{errors.role_in_task}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes about this assignment..."
              />
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

export default WorkerAssignmentForm;