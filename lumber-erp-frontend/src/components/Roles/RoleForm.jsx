import React, { useState, useEffect } from 'react';
import { X, Save, UserCog } from 'lucide-react';
import { rolesAPI } from '../../services/api';

const RoleForm = ({ role, users, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    user_id: '',
    role_name: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (role) {
      setFormData({
        user_id: role.user_id || '',
        role_name: role.role_name || '',
        description: role.description || '',
      });
    }
  }, [role]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.user_id) {
      newErrors.user_id = 'User is required';
    }
    
    if (!formData.role_name.trim()) {
      newErrors.role_name = 'Role name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      const submitData = {
        ...formData,
        user_id: parseInt(formData.user_id),
      };

      if (role) {
        await rolesAPI.update(role.role_id, submitData);
      } else {
        await rolesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving role:', error);
      alert('Error saving role. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <UserCog size={24} />
            <h2>{role ? 'Edit Role' : 'Create New Role'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="user_id">Assign to User *</label>
              <select
                id="user_id"
                name="user_id"
                value={formData.user_id}
                onChange={handleChange}
                className={errors.user_id ? 'error' : ''}
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.first_name} {user.last_name} ({user.email})
                  </option>
                ))}
              </select>
              {errors.user_id && <span className="error-text">{errors.user_id}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="role_name">Role Name *</label>
              <input
                id="role_name"
                name="role_name"
                type="text"
                value={formData.role_name}
                onChange={handleChange}
                className={errors.role_name ? 'error' : ''}
                placeholder="e.g., Warehouse Manager"
              />
              {errors.role_name && <span className="error-text">{errors.role_name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                className={errors.description ? 'error' : ''}
                placeholder="Describe the responsibilities and permissions for this role..."
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            {formData.role_name && (
              <div className="role-preview">
                <h4>Role Preview</h4>
                <div className="preview-card">
                  <UserCog size={20} />
                  <div>
                    <strong>{formData.role_name}</strong>
                    <p>{formData.description}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              <Save size={18} />
              {loading ? 'Saving...' : role ? 'Update Role' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoleForm;