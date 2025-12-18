import React, { useState, useEffect } from 'react';
import PageHeader from './PageHeader';
import SearchBar from './SearchBar';
import DataTable from './DataTable';
import './Shared.css';

const GenericCRUD = ({
  title,
  subtitle,
  apiService,
  columns,
  FormComponent,
  idField = 'id',
  searchFields = [],
}) => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(item =>
        searchFields.some(field =>
          String(item[field]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredItems(filtered);
    }
  }, [searchTerm, items]);

  const fetchItems = async () => {
    try {
      const response = await apiService.getAll();
      setItems(response.data);
      setFilteredItems(response.data);
    } catch (error) {
      showAlert('Error fetching data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await apiService.delete(id);
        showAlert('Item deleted successfully', 'success');
        fetchItems();
      } catch (error) {
        showAlert('Error deleting item', 'error');
      }
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleFormSuccess = () => {
    setShowModal(false);
    setEditingItem(null);
    fetchItems();
    showAlert(editingItem ? 'Item updated successfully' : 'Item created successfully', 'success');
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <div className="crud-container">
      <PageHeader title={title} subtitle={subtitle} onAdd={handleCreate} />

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="card">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder={`Search ${title.toLowerCase()}...`}
        />

        <DataTable
          columns={columns}
          data={filteredItems}
          onEdit={handleEdit}
          onDelete={handleDelete}
          idField={idField}
          loading={loading}
        />
      </div>

      {showModal && FormComponent && (
        <FormComponent
          item={editingItem}
          onClose={() => setShowModal(false)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default GenericCRUD;