import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import FuelLogForm from './FuelLogForm';
import { fuelLogsAPI } from '../../services/api';

const FuelLogs = () => {
  const columns = [
    { label: 'Log ID', field: 'fuel_log_id' },
    { label: 'Driver ID', field: 'driver_id' },
    { label: 'Truck ID', field: 'truck_id' },
    { 
      label: 'Trip Date', 
      field: 'trip_date', // Changed from 'refuel_date' to 'trip_date'
      render: (row) => new Date(row.trip_date).toLocaleDateString()
    },
    { 
      label: 'Distance (km)', 
      field: 'distance_traveled', // Changed from 'quantity_liters' to 'distance_traveled'
      render: (row) => row.distance_traveled.toLocaleString(undefined, {minimumFractionDigits: 1})
    },
  ];

  return (
    <GenericCRUD
      title="Fuel Logs"
      subtitle="Track trips and distance traveled"
      apiService={fuelLogsAPI}
      columns={columns}
      FormComponent={FuelLogForm}
      idField="fuel_log_id"
      searchFields={[]}
    />
  );
};

export default FuelLogs;