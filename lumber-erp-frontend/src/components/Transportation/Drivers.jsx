import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import DriverForm from './DriverForm';
import { driversAPI } from '../../services/api';

const Drivers = () => {
  const columns = [
    { label: 'Driver ID', field: 'driver_id' },
    { label: 'Employee ID', field: 'employee_id' },
    { label: 'License Number', field: 'license_number' },
    { 
      label: 'Experience (Years)', 
      field: 'experience_years',
      render: (row) => row.experience_years + ' years'
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => {
        const colors = {
          'Active': 'success',
          'Inactive': 'error',
          'On Leave': 'warning',
          'Suspended': 'error'
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
      title="Drivers"
      subtitle="Manage driver information and licenses"
      apiService={driversAPI}
      columns={columns}
      FormComponent={DriverForm}
      idField="driver_id"
      searchFields={['license_number', 'status']}
    />
  );
};

export default Drivers;