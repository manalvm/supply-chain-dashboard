import React, { useState, useEffect } from 'react';
import { X, Save, Truck } from 'lucide-react';
import { trucksAPI, transportCompaniesAPI } from '../../services/api';

const TruckForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    transport_company_id: '',
    license_plate: '',
    fuel_type: '',
    capacity: '',
    status: 'Available',
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Available', 'In Use', 'Maintenance', 'Out of Service'];
  const fuelTypes = ['Diesel', 'Gasoline', 'Electric', 'Hybrid', 'CNG', 'LPG'];

  useEffect(() => {
    fetchCompanies();
    if (item) {
      setFormData({
        transport_company_id: item.company_id || '', // Backend returns 'company_id'
        license_plate: item.plate_number || '', // Backend returns 'plate_number'
        fuel_type: item.fuel_type || 'Diesel',
        capacity: item.capacity || '',
        status: item.status || 'Available',
      });
    }
  }, [item]);

  const fetchCompanies = async () => {
    try {
      const response = await transportCompaniesAPI.getAll();
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.transport_company_id) newErrors.transport_company_id = 'Company is required';
    if (!formData.license_plate.trim()) newErrors.license_plate = 'License plate is required';
    if (!formData.fuel_type) newErrors.fuel_type = 'Fuel type is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    
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
      // Map frontend fields to backend expected fields
      const submitData = {
        company_id: parseInt(formData.transport_company_id), // Backend expects 'company_id'
        plate_number: formData.license_plate, // Backend expects 'plate_number'
        capacity: parseFloat(formData.capacity),
        fuel_type: formData.fuel_type, // Backend expects 'fuel_type'
        status: formData.status,
      };

      if (item) {
        await trucksAPI.update(item.truck_id, submitData);
      } else {
        await trucksAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving truck:', error);
      alert('Error saving truck. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Truck size={24} />
            <h2>{item ? 'Edit Truck' : 'Add New Truck'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="transport_company_id">Transport Company *</label>
              <select
                id="transport_company_id"
                name="transport_company_id"
                value={formData.transport_company_id}
                onChange={handleChange}
                className={errors.transport_company_id ? 'error' : ''}
              >
                <option value="">Select Company</option>
                {companies.map(company => (
                  <option key={company.company_id} value={company.company_id}>
                    {company.company_name}
                  </option>
                ))}
              </select>
              {errors.transport_company_id && <span className="error-text">{errors.transport_company_id}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="license_plate">License Plate *</label>
                <input
                  id="license_plate"
                  name="license_plate"
                  type="text"
                  value={formData.license_plate}
                  onChange={handleChange}
                  className={errors.license_plate ? 'error' : ''}
                  placeholder="ABC-1234"
                />
                {errors.license_plate && <span className="error-text">{errors.license_plate}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="fuel_type">Fuel Type *</label>
                <select
                  id="fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={handleChange}
                  className={errors.fuel_type ? 'error' : ''}
                >
                  <option value="">Select Fuel Type</option>
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.fuel_type && <span className="error-text">{errors.fuel_type}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="capacity">Capacity (tons) *</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  step="0.1"
                  value={formData.capacity}
                  onChange={handleChange}
                  className={errors.capacity ? 'error' : ''}
                />
                {errors.capacity && <span className="error-text">{errors.capacity}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
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

export default TruckForm;