import React, { useState, useEffect } from 'react';
import { X, Save, Leaf } from 'lucide-react';
import { treeSpeciesAPI } from '../../services/api';

const TreeSpeciesForm = ({ item, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    species_name: '',
    average_height: '',
    density: '',
    moisture_content: '',
    grade: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const grades = ['A+', 'A', 'B', 'C', 'D'];

  useEffect(() => {
    if (item) {
      setFormData({
        species_name: item.species_name || '',
        average_height: item.average_height || '',
        density: item.density || '',
        moisture_content: item.moisture_content || '',
        grade: item.grade || '',
      });
    }
  }, [item]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.species_name.trim()) newErrors.species_name = 'Species name is required';
    if (!formData.grade) newErrors.grade = 'Grade is required';
    
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
        average_height: parseFloat(formData.average_height) || null,
        density: parseFloat(formData.density) || null,
        moisture_content: parseFloat(formData.moisture_content) || null,
      };

      if (item) {
        await treeSpeciesAPI.update(item.species_id, submitData);
      } else {
        await treeSpeciesAPI.create(submitData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving species:', error);
      alert('Error saving species. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrapper">
            <Leaf size={24} />
            <h2>{item ? 'Edit Tree Species' : 'Add Tree Species'}</h2>
          </div>
          <button className="btn btn-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="input-group">
              <label htmlFor="species_name">Species Name *</label>
              <input
                id="species_name"
                name="species_name"
                type="text"
                value={formData.species_name}
                onChange={handleChange}
                className={errors.species_name ? 'error' : ''}
                placeholder="Douglas Fir"
              />
              {errors.species_name && <span className="error-text">{errors.species_name}</span>}
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="average_height">Average Height (ft)</label>
                <input
                  id="average_height"
                  name="average_height"
                  type="number"
                  step="0.1"
                  value={formData.average_height}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="density">Density (kg/m³)</label>
                <input
                  id="density"
                  name="density"
                  type="number"
                  step="0.1"
                  value={formData.density}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="moisture_content">Moisture Content (%)</label>
                <input
                  id="moisture_content"
                  name="moisture_content"
                  type="number"
                  step="0.1"
                  value={formData.moisture_content}
                  onChange={handleChange}
                />
              </div>

              <div className="input-group">
                <label htmlFor="grade">Grade *</label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={errors.grade ? 'error' : ''}
                >
                  <option value="">Select Grade</option>
                  {grades.map(grade => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
                {errors.grade && <span className="error-text">{errors.grade}</span>}
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

export default TreeSpeciesForm;