import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import RouteForm from './RouteForm';
import { routesAPI } from '../../services/api';

const RoutesList = () => {
  const columns = [
    { label: 'Route ID', field: 'route_id' },
    { label: 'Origin', field: 'start_location' }, // Changed from 'origin' to 'start_location'
    { label: 'Destination', field: 'end_location' }, // Changed from 'destination' to 'end_location'
    { 
      label: 'Distance (km)', 
      field: 'distance_km',
      render: (row) => row.distance_km.toLocaleString()
    },
    { 
      label: 'Est. Time', 
      field: 'estimated_time', // Changed from 'estimated_time_hours' to 'estimated_time'
      render: (row) => row.estimated_time
    },
  ];

  return (
    <GenericCRUD
      title="Routes"
      subtitle="Manage delivery routes and distances"
      apiService={routesAPI}
      columns={columns}
      FormComponent={RouteForm}
      idField="route_id"
      searchFields={['start_location', 'end_location']} // Updated search fields
    />
  );
};

export default RoutesList;