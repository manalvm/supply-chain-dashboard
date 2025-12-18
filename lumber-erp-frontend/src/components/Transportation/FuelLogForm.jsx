import React, { useState, useEffect } from 'react';
import { X, Save, Fuel } from 'lucide-react';
import { fuelLogsAPI, trucksAPI, driversAPI } from '../../services/api';

const FuelLogForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    driver_id: '',
    truck_id: '',
    trip_date: '',
    distance_traveled: '',
  });
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
    if (item) {
      setFormData({
        driver_id: item.driver_id || '',
        truck_id: item.truck_id || '',
        trip_date: item.trip_date ? item.trip_date.split('T')[0] : '',
        distance_traveled: item.distance_traveled || '',
      });
    } else {
      setFormData(prev => ({ ...prev, trip_date: new Date().toISOString().split('T')[0] }));
    }
  }, [item]);

  const fetchData = async () => {
    try {
      const [truckRes, driverRes] = await Promise.all([
        trucksAPI.getAll(),
        driversAPI.getAll(),
      ]);
      setTrucks(truckRes.data);
      setDrivers(driverRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.driver_id) newErrors.driver_id = 'Driver is required';
    if (!formData.truck_id) newErrors.truck_id = 'Truck is required';
    if (!formData.trip_date) newErrors.trip_date = 'Trip date is required';
    if (!formData.distance_traveled) newErrors.distance_traveled = 'Distance is required';
    
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
        driver_id: parseInt(formData.driver_id),
        truck_id: parseInt(formData.truck_id),
        trip_date: formData.trip_date,
        distance_traveled: parseFloat(formData.distance_traveled),
      };

      if (item) {
        await fuelLogsAPI.update(item.fuel_log_id, submitData);
      } else {
        await fuelLogsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving fuel log:', error);
      alert('Error saving fuel log. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Fuel size={24} />
            <h2>{item ? 'Edit Fuel Log' : 'Add Fuel Log'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="driver_id">Driver *</label>
                <select
                  id="driver_id"
                  name="driver_id"
                  value={formData.driver_id}
                  onChange={handleChange}
                  className={errors.driver_id ? 'error' : ''}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(driver => (
                    <option key={driver.driver_id} value={driver.driver_id}>
                      Driver #{driver.driver_id} - License: {driver.license_number}
                    </option>
                  ))}
                </select>
                {errors.driver_id && <span className="error-text">{errors.driver_id}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="truck_id">Truck *</label>
                <select
                  id="truck_id"
                  name="truck_id"
                  value={formData.truck_id}
                  onChange={handleChange}
                  className={errors.truck_id ? 'error' : ''}
                >
                  <option value="">Select Truck</option>
                  {trucks.map(truck => (
                    <option key={truck.truck_id} value={truck.truck_id}>
                      {truck.plate_number} - {truck.fuel_type}
                    </option>
                  ))}
                </select>
                {errors.truck_id && <span className="error-text">{errors.truck_id}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="trip_date">Trip Date *</label>
                <input
                  id="trip_date"
                  name="trip_date"
                  type="date"
                  value={formData.trip_date}
                  onChange={handleChange}
                  className={errors.trip_date ? 'error' : ''}
                />
                {errors.trip_date && <span className="error-text">{errors.trip_date}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="distance_traveled">Distance Traveled (km) *</label>
                <input
                  id="distance_traveled"
                  name="distance_traveled"
                  type="number"
                  step="0.1"
                  value={formData.distance_traveled}
                  onChange={handleChange}
                  className={errors.distance_traveled ? 'error' : ''}
                />
                {errors.distance_traveled && <span className="error-text">{errors.distance_traveled}</span>}
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

export default FuelLogForm;