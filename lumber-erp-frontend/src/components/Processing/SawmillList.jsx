import React from 'react';
import { Factory } from 'lucide-react';
import GenericCRUD from '../Shared/GenericCRUD';
import SawmillForm from './SawmillForm';
import { sawmillsAPI } from '../../services/api';

const SawmillList = () => {
  const columns = [
    { label: 'ID', field: 'sawmill_id' },
    { label: 'Name', field: 'name' },
    { label: 'Location', field: 'location' },
    { 
      label: 'Capacity', 
      field: 'capacity',
      render: (row) => row.capacity.toLocaleString() + ' units'
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => (
        <span className={`badge badge-${row.status === 'Operational' ? 'success' : 'warning'}`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Sawmills"
      subtitle="Manage sawmill facilities and operations"
      apiService={sawmillsAPI}
      columns={columns}
      FormComponent={SawmillForm}
      idField="sawmill_id"
      searchFields={['name', 'location']}
    />
  );
};

export default SawmillList;