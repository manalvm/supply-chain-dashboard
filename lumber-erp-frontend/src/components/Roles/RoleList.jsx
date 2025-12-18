import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, UserCog, Search, User } from 'lucide-react';
import { rolesAPI, usersAPI } from '../../services/api';
import RoleForm from './RoleForm';
import './Roles.css';

const RoleList = () => {
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = roles.filter(role =>
      role.role_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [searchTerm, roles]);

  const fetchData = async () => {
    try {
      const [rolesRes, usersRes] = await Promise.all([
        rolesAPI.getAll(),
        usersAPI.getAll(),
      ]);
      setRoles(rolesRes.data);
      setFilteredRoles(rolesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      showAlert('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? `${user.first_name} ${user.last_name}` : 'Unknown User';
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        await rolesAPI.delete(id);
        showAlert('Role deleted successfully', 'success');
        fetchData();
      } catch (error) {
        showAlert('Error deleting role', 'error');
      }
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingRole(null);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setEditingRole(null);
    fetchData();
    showAlert(
      editingRole ? 'Role updated successfully' : 'Role created successfully',
      'success'
    );
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="roles-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Roles Management</h1>
          <p className="page-subtitle">Manage user roles and responsibilities</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={18} />
          Add New Role
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
            placeholder="Search roles by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="roles-grid">
          {filteredRoles.length === 0 ? (
            <div className="no-data">No roles found</div>
          ) : (
            filteredRoles.map((role) => (
              <div key={role.role_id} className="role-card">
                <div className="role-header">
                  <div className="role-icon">
                    <UserCog size={24} />
                  </div>
                  <div className="role-actions">
                    <button
                      className="btn btn-icon btn-secondary"
                      onClick={() => handleEdit(role)}
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn btn-icon btn-danger"
                      onClick={() => handleDelete(role.role_id)}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="role-name">{role.role_name}</h3>
                <p className="role-description">{role.description}</p>
                
                <div className="role-footer">
                  <div className="role-user">
                    <User size={14} />
                    <span>{getUserName(role.user_id)}</span>
                  </div>
                  <span className="role-id">ID: #{role.role_id}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <RoleForm
          role={editingRole}
          users={users}
          onClose={() => setShowModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default RoleList;