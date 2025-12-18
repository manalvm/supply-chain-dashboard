import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import ForestForm from './ForestForm';
import { forestsAPI } from '../../services/api';

const ForestList = () => {
  const columns = [
    { label: 'ID', field: 'forest_id' },
    { label: 'Forest Name', field: 'forest_name' },
    { label: 'Location', field: 'geo_location' },
    { 
      label: 'Area Size (acres)', 
      field: 'area_size',
      render: (row) => row.area_size.toLocaleString()
    },
    { label: 'Ownership', field: 'ownership_type' },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => (
        <span className={`badge badge-${row.status === 'Active' ? 'success' : 'warning'}`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Forests"
      subtitle="Manage forest locations and properties"
      apiService={forestsAPI}
      columns={columns}
      FormComponent={ForestForm}
      idField="forest_id"
      searchFields={['forest_name', 'geo_location', 'ownership_type']}
    />
  );
};

export default ForestList;