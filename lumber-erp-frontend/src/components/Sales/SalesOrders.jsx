import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import SalesOrderForm from './SalesOrderForm';
import { salesOrdersAPI } from '../../services/api';

const SalesOrders = () => {
  const columns = [
    { label: 'SO ID', field: 'soid' }, // Changed from 'so_id' to 'soid'
    { label: 'Customer ID', field: 'customer_id' },
    { 
      label: 'Order Date', 
      field: 'order_date',
      render: (row) => new Date(row.order_date).toLocaleDateString()
    },
    { 
      label: 'Delivery Date', 
      field: 'delivery_date',
      render: (row) => row.delivery_date ? new Date(row.delivery_date).toLocaleDateString() : 'N/A'
    },
    { 
      label: 'Total Amount', 
      field: 'total_amount',
      render: (row) => '$' + row.total_amount.toLocaleString(undefined, {minimumFractionDigits: 2})
    },
    { 
      label: 'Status', 
      field: 'status', // Changed from 'order_status' to 'status'
      render: (row) => {
        const colors = {
          'Pending': 'warning',
          'Processing': 'info',
          'Shipped': 'success',
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
      title="Sales Orders"
      subtitle="Manage customer orders and sales"
      apiService={salesOrdersAPI}
      columns={columns}
      FormComponent={SalesOrderForm}
      idField="soid" // Changed from "so_id" to "soid"
      searchFields={['status']} // Changed from 'order_status' to 'status'
    />
  );
};

export default SalesOrders;