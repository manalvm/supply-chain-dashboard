import React, { useState, useEffect } from 'react';
import { X, Save, MapPin } from 'lucide-react';
import { routesAPI } from '../../services/api';

const RouteForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    distance_km: '',
    estimated_time_hours: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({
        origin: item.start_location || '', // Backend returns 'start_location'
        destination: item.end_location || '', // Backend returns 'end_location'
        distance_km: item.distance_km || '',
        estimated_time_hours: item.estimated_time || '', // Backend returns 'estimated_time' as string
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.origin.trim()) newErrors.origin = 'Origin is required';
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required';
    if (!formData.distance_km) newErrors.distance_km = 'Distance is required';
    if (!formData.estimated_time_hours) newErrors.estimated_time_hours = 'Estimated time is required';
    
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
        start_location: formData.origin, // Backend expects 'start_location'
        end_location: formData.destination, // Backend expects 'end_location'
        distance_km: parseFloat(formData.distance_km),
        estimated_time: formData.estimated_time_hours, // Backend expects 'estimated_time' as string
      };

      if (item) {
        await routesAPI.update(item.route_id, submitData);
      } else {
        await routesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving route:', error);
      alert('Error saving route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <MapPin size={24} />
            <h2>{item ? 'Edit Route' : 'Add New Route'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="origin">Origin *</label>
                <input
                  id="origin"
                  name="origin"
                  type="text"
                  value={formData.origin}
                  onChange={handleChange}
                  className={errors.origin ? 'error' : ''}
                  placeholder="Portland, OR"
                />
                {errors.origin && <span className="error-text">{errors.origin}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="destination">Destination *</label>
                <input
                  id="destination"
                  name="destination"
                  type="text"
                  value={formData.destination}
                  onChange={handleChange}
                  className={errors.destination ? 'error' : ''}
                  placeholder="Seattle, WA"
                />
                {errors.destination && <span className="error-text">{errors.destination}</span>}
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="distance_km">Distance (km) *</label>
                <input
                  id="distance_km"
                  name="distance_km"
                  type="number"
                  step="0.1"
                  value={formData.distance_km}
                  onChange={handleChange}
                  className={errors.distance_km ? 'error' : ''}
                />
                {errors.distance_km && <span className="error-text">{errors.distance_km}</span>}
              </div>

              <div className="input-group">
                <label htmlFor="estimated_time_hours">Est. Time (e.g., "2h 30m") *</label>
                <input
                  id="estimated_time_hours"
                  name="estimated_time_hours"
                  type="text"
                  value={formData.estimated_time_hours}
                  onChange={handleChange}
                  className={errors.estimated_time_hours ? 'error' : ''}
                  placeholder="2h 30m"
                />
                {errors.estimated_time_hours && <span className="error-text">{errors.estimated_time_hours}</span>}
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

export default RouteForm;