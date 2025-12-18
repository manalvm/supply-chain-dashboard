import React, { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { shipmentsAPI, salesOrdersAPI, trucksAPI, driversAPI, routesAPI, transportCompaniesAPI } from '../../services/api';

const ShipmentForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    so_id: '',
    truck_id: '',
    driver_id: '',
    company_id: '',
    route_id: '',
    shipment_date: '',
    status: 'Scheduled',
    proof_of_delivery: '',
  });
  const [salesOrders, setSalesOrders] = useState([]);
  const [trucks, setTrucks] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const statuses = ['Scheduled', 'In Transit', 'Delivered', 'Cancelled'];

  useEffect(() => {
    fetchData();
    if (item) {
      setFormData({
        so_id: item.soid || '', // Backend returns 'soid'
        truck_id: item.truck_id || '',
        driver_id: item.driver_id || '',
        company_id: item.company_id || '',
        route_id: item.route_id || '',
        shipment_date: item.shipment_date ? item.shipment_date.split('T')[0] : '',
        status: item.status || 'Scheduled',
        proof_of_delivery: item.proof_of_delivery || '',
      });
    } else {
      setFormData(prev => ({ 
        ...prev, 
        shipment_date: new Date().toISOString().split('T')[0]
      }));
    }
  }, [item]);

  const fetchData = async () => {
    try {
      const [soRes, truckRes, driverRes, routeRes, companyRes] = await Promise.all([
        salesOrdersAPI.getAll(),
        trucksAPI.getAll(),
        driversAPI.getAll(),
        routesAPI.getAll(),
        transportCompaniesAPI.getAll(),
      ]);
      setSalesOrders(soRes.data);
      setTrucks(truckRes.data);
      setDrivers(driverRes.data);
      setRoutes(routeRes.data);
      setCompanies(companyRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.so_id) newErrors.so_id = 'Sales order is required';
    if (!formData.truck_id) newErrors.truck_id = 'Truck is required';
    if (!formData.driver_id) newErrors.driver_id = 'Driver is required';
    if (!formData.company_id) newErrors.company_id = 'Company is required';
    if (!formData.route_id) newErrors.route_id = 'Route is required';
    if (!formData.shipment_date) newErrors.shipment_date = 'Shipment date is required';
    
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
        soid: parseInt(formData.so_id), // Backend expects 'soid'
        truck_id: parseInt(formData.truck_id),
        driver_id: parseInt(formData.driver_id),
        company_id: parseInt(formData.company_id), // Backend expects 'company_id'
        route_id: parseInt(formData.route_id),
        shipment_date: formData.shipment_date, // Backend expects 'shipment_date'
        status: formData.status,
        proof_of_delivery: formData.proof_of_delivery || null, // Backend expects 'proof_of_delivery'
      };

      if (item) {
        await shipmentsAPI.update(item.shipment_id, submitData);
      } else {
        await shipmentsAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving shipment:', error);
      alert('Error saving shipment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Package size={24} />
            <h2>{item ? 'Edit Shipment' : 'Create Shipment'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="so_id">Sales Order *</label>
              <select
                id="so_id"
                name="so_id"
                value={formData.so_id}
                onChange={handleChange}
                className={errors.so_id ? 'error' : ''}
              >
                <option value="">Select Sales Order</option>
                {salesOrders.map(so => (
                  <option key={so.soid} value={so.soid}>
                    SO #{so.soid} - {so.status}
                  </option>
                ))}
              </select>
              {errors.so_id && <span className="error-text">{errors.so_id}</span>}
            </div>

            <div className="form-grid">
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
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="company_id">Transport Company *</label>
                <select
                  id="company_id"
                  name="company_id"
                  value={formData.company_id}
                  onChange={handleChange}
                  className={errors.company_id ? 'error' : ''}
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.company_id} value={company.company_id}>
                      {company.company_name}
                    </option>
                  ))}
                </select>
                {errors.company_id && <span className="error-text">{errors.company_id}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="route_id">Route *</label>
                <select
                  id="route_id"
                  name="route_id"
                  value={formData.route_id}
                  onChange={handleChange}
                  className={errors.route_id ? 'error' : ''}
                >
                  <option value="">Select Route</option>
                  {routes.map(route => (
                    <option key={route.route_id} value={route.route_id}>
                      {route.start_location} → {route.end_location} ({route.distance_km} km)
                    </option>
                  ))}
                </select>
                {errors.route_id && <span className="error-text">{errors.route_id}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="shipment_date">Shipment Date *</label>
                <input
                  id="shipment_date"
                  name="shipment_date"
                  type="date"
                  value={formData.shipment_date}
                  onChange={handleChange}
                  className={errors.shipment_date ? 'error' : ''}
                />
                {errors.shipment_date && <span className="error-text">{errors.shipment_date}</span>}
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

            <div className="input-group">
              <label htmlFor="proof_of_delivery">Proof of Delivery</label>
              <input
                id="proof_of_delivery"
                name="proof_of_delivery"
                type="text"
                value={formData.proof_of_delivery}
                onChange={handleChange}
                placeholder="POD-12345 or URL"
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

export default ShipmentForm;