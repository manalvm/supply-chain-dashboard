import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Shield, Search } from 'lucide-react';
import { permissionsAPI } from '../../services/api';
import PermissionForm from './PermissionForm';
import './Permissions.css';

const PermissionList = () => {
  const [permissions, setPermissions] = useState([]);
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchPermissions();
  }, []);

  useEffect(() => {
    const filtered = permissions.filter(permission =>
      permission.module_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.action_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPermissions(filtered);
  }, [searchTerm, permissions]);

  const fetchPermissions = async () => {
    try {
      const response = await permissionsAPI.getAll();
      setPermissions(response.data);
      setFilteredPermissions(response.data);
    } catch (error) {
      showAlert('Error fetching permissions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await permissionsAPI.delete(id);
        showAlert('Permission deleted successfully', 'success');
        fetchPermissions();
      } catch (error) {
        showAlert('Error deleting permission', 'error');
      }
    }
  };

  const handleEdit = (permission) => {
    setEditingPermission(permission);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingPermission(null);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setEditingPermission(null);
    fetchPermissions();
    showAlert(
      editingPermission ? 'Permission updated successfully' : 'Permission created successfully',
      'success'
    );
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const getActionColor = (action) => {
    const colors = {
      CREATE: 'success',
      READ: 'info',
      UPDATE: 'warning',
      DELETE: 'error',
    };
    return colors[action] || 'default';
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="permissions-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Permissions Management</h1>
          <p className="page-subtitle">Manage system permissions and access controls</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} />
          Add New Permission
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search permissions by module or action..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="permissions-grid">
          {filteredPermissions.length === 0 ? (
            <div className="no-data">No permissions found</div>
          ) : (
            filteredPermissions.map((permission) => (
              <div key={permission.permission_id} className="permission-card">
                <div className="permission-icon">
                  <Shield size={24} />
                </div>
                <div className="permission-content">
                  <h3 className="permission-module">{permission.module_name}</h3>
                  <span className={`permission-action action-${getActionColor(permission.action_type)}`}>
                    {permission.action_type}
                  </span>
                  <p className="permission-id">ID: #{permission.permission_id}</p>
                </div>
                <div className="permission-actions">
                  <button
                    className="btn btn-icon btn-secondary"
                    onClick={() => handleEdit(permission)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn btn-icon btn-danger"
                    onClick={() => handleDelete(permission.permission_id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <PermissionForm
          permission={editingPermission}
          onClose={() => setShowModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default PermissionList;