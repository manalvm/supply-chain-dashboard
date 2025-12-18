import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import TruckForm from './TruckForm';
import { trucksAPI } from '../../services/api';

const Trucks = () => {
  const columns = [
    { label: 'Truck ID', field: 'truck_id' },
    { label: 'Company ID', field: 'company_id' }, // Changed from 'transport_company_id' to 'company_id'
    { label: 'License Plate', field: 'plate_number' }, // Changed from 'license_plate' to 'plate_number'
    { label: 'Fuel Type', field: 'fuel_type' }, // Changed from 'model' to 'fuel_type'
    { 
      label: 'Capacity (tons)', 
      field: 'capacity',
      render: (row) => row.capacity.toLocaleString()
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => {
        const colors = {
          'Available': 'success',
          'In Use': 'info',
          'Maintenance': 'warning',
          'Out of Service': 'error'
        };
        return (
          <span className={`badge badge-${colors[row.status] || 'default'}`}>
            {row.status}
          </span>
        );
      }
    },
  ];

  return (
    <GenericCRUD
      title="Trucks"
      subtitle="Manage fleet vehicles and capacity"
      apiService={trucksAPI}
      columns={columns}
      FormComponent={TruckForm}
      idField="truck_id"
      searchFields={['plate_number', 'fuel_type', 'status']} // Updated search fields
    />
  );
};

export default Trucks;