import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import PurchaseOrderForm from './PurchaseOrderForm';
import { purchaseOrdersAPI } from '../../services/api';

const PurchaseOrders = () => {
  const columns = [
    { label: 'PO ID', field: 'poid' }, // Changed from 'po_id' to 'poid'
    { label: 'Supplier ID', field: 'supplier_id' },
    { 
      label: 'Order Date', 
      field: 'order_date',
      render: (row) => new Date(row.order_date).toLocaleDateString()
    },
    { 
      label: 'Expected Delivery', 
      field: 'expected_delivery_date',
      render: (row) => row.expected_delivery_date ? new Date(row.expected_delivery_date).toLocaleDateString() : 'N/A'
    },
    { 
      label: 'Total Amount', 
      field: 'total_amount',
      render: (row) => '$' + row.total_amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => {
        const colors = {
          'Pending': 'warning',
          'Approved': 'info',
          'Received': 'success',
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
      title="Purchase Orders"
      subtitle="Manage procurement and supplier orders"
      apiService={purchaseOrdersAPI}
      columns={columns}
      FormComponent={PurchaseOrderForm}
      idField="poid" // Changed from "po_id" to "poid"
      searchFields={['status']}
    />
  );
};

export default PurchaseOrders;