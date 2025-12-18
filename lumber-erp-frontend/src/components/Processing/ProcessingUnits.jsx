import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import ProcessingUnitForm from './ProcessingUnitForm';
import { processingUnitsAPI } from '../../services/api';

const ProcessingUnits = () => {
  const columns = [
    { label: 'Unit ID', field: 'unit_id' },
    { label: 'Sawmill ID', field: 'sawmill_id' },
    { label: 'Cutting', field: 'cutting' },
    { label: 'Drying', field: 'drying' },
    { label: 'Finishing', field: 'finishing' },
    { 
      label: 'Capacity', 
      field: 'capacity',
      render: (row) => row.capacity.toLocaleString() + ' units'
    },
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
      title="Processing Units"
      subtitle="Manage processing equipment and lines"
      apiService={processingUnitsAPI}
      columns={columns}
      FormComponent={ProcessingUnitForm}
      idField="unit_id"
      searchFields={['cutting', 'drying', 'finishing']}
    />
  );
};

export default ProcessingUnits;