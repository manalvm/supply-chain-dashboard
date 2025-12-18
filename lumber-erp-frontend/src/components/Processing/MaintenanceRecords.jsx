import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import MaintenanceRecordForm from './MaintenanceRecordForm';
import { maintenanceRecordsAPI } from '../../services/api';

const MaintenanceRecords = () => {
  const columns = [
    { label: 'Maintenance ID', field: 'maintenance_id' },
    { label: 'Unit ID', field: 'unit_id' },
    { 
      label: 'Date', 
      field: 'maintenance_date',
      render: (row) => new Date(row.maintenance_date).toLocaleDateString()
    },
    { label: 'Description', field: 'description' },
    { 
      label: 'Cost', 
      field: 'cost',
      render: (row) => '$' + row.cost.toFixed(2)
    },
    { 
      label: 'Downtime (hrs)', 
      field: 'downtime_hours',
      render: (row) => row.downtime_hours
    },
  ];

  return (
    <GenericCRUD
      title="Maintenance Records"
      subtitle="Track equipment maintenance and repairs"
      apiService={maintenanceRecordsAPI}
      columns={columns}
      FormComponent={MaintenanceRecordForm}
      idField="maintenance_id"
      searchFields={['description', 'parts_used']}
    />
  );
};

export default MaintenanceRecords;