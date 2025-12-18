import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import HarvestScheduleForm from './HarvestScheduleForm';
import { harvestSchedulesAPI } from '../../services/api';

const HarvestSchedules = () => {
  const columns = [
    { label: 'Schedule ID', field: 'schedule_id' },
    { label: 'Forest ID', field: 'forest_id' },
    { 
      label: 'Start Date', 
      field: 'start_date',
      render: (row) => new Date(row.start_date).toLocaleDateString()
    },
    { 
      label: 'End Date', 
      field: 'end_date',
      render: (row) => new Date(row.end_date).toLocaleDateString()
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => {
        const colors = {
          'Scheduled': 'warning',
          'In Progress': 'info',
          'Completed': 'success',
          'Cancelled': 'error'
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
      title="Harvest Schedules"
      subtitle="Plan and manage harvest operations"
      apiService={harvestSchedulesAPI}
      columns={columns}
      FormComponent={HarvestScheduleForm}
      idField="schedule_id"
      searchFields={['status']}
    />
  );
};

export default HarvestSchedules;