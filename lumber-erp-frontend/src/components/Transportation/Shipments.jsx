import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import ShipmentForm from './ShipmentForm';
import { shipmentsAPI } from '../../services/api';

const Shipments = () => {
  const columns = [
    { label: 'Shipment ID', field: 'shipment_id' },
    { label: 'SO ID', field: 'soid' }, // Changed from 'so_id' to 'soid'
    { label: 'Truck ID', field: 'truck_id' },
    { label: 'Driver ID', field: 'driver_id' },
    { label: 'Company ID', field: 'company_id' },
    { label: 'Route ID', field: 'route_id' },
    { 
      label: 'Shipment Date', 
      field: 'shipment_date', // Changed from 'departure_date' to 'shipment_date'
      render: (row) => row.shipment_date ? new Date(row.shipment_date).toLocaleDateString() : 'N/A'
    },
    { 
      label: 'Proof of Delivery', 
      field: 'proof_of_delivery',
      render: (row) => row.proof_of_delivery || 'N/A'
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => {
        const colors = {
          'Scheduled': 'warning',
          'In Transit': 'info',
          'Delivered': 'success',
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
      title="Shipments"
      subtitle="Track deliveries and shipment status"
      apiService={shipmentsAPI}
      columns={columns}
      FormComponent={ShipmentForm}
      idField="shipment_id"
      searchFields={['status']}
    />
  );
};

export default Shipments;