import React, { useState, useEffect } from 'react';
import { X, Save, Shield } from 'lucide-react';
import { permissionsAPI } from '../../services/api';

const PermissionForm = ({ permission, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    module_name: '',
    action_type: 'READ',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const modules = [
    'User Management',
    'HR & Employees',
    'Suppliers',
    'Forest & Harvesting',
    'Processing & Sawmill',
    'Quality Control',
    'Warehouse & Inventory',
    'Procurement',
    'Sales & Customers',
    'Invoicing & Payments',
    'Transportation',
    'Audit & Logs',
  ];

  const actionTypes = ['CREATE', 'READ', 'UPDATE', 'DELETE'];

  useEffect(() => {
    if (permission) {
      setFormData({
        module_name: permission.module_name || '',
        action_type: permission.action_type || 'READ',
      });
    }
  }, [permission]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.module_name.trim()) {
      newErrors.module_name = 'Module name is required';
    }
    
    if (!formData.action_type) {
      newErrors.action_type = 'Action type is required';
    }
    
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
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      if (permission) {
        await permissionsAPI.update(permission.permission_id, formData);
      } else {
        await permissionsAPI.create(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving permission:', error);
      alert('Error saving permission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Shield size={24} />
            <h2>{permission ? 'Edit Permission' : 'Create New Permission'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="module_name">Module Name *</label>
              <select
                id="module_name"
                name="module_name"
                value={formData.module_name}
                onChange={handleChange}
                className={errors.module_name ? 'error' : ''}
              >
                <option value="">Select a module</option>
                {modules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
              {errors.module_name && <span className="error-text">{errors.module_name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="action_type">Action Type *</label>
              <select
                id="action_type"
                name="action_type"
                value={formData.action_type}
                onChange={handleChange}
                className={errors.action_type ? 'error' : ''}
              >
                {actionTypes.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
              {errors.action_type && <span className="error-text">{errors.action_type}</span>}
            </div>

            <div className="permission-preview">
              <h4>Permission Preview</h4>
              <div className="preview-content">
                <Shield size={20} />
                <span>
                  <strong>{formData.module_name || 'Module'}</strong> - {formData.action_type}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : permission ? 'Update Permission' : 'Create Permission'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionForm;