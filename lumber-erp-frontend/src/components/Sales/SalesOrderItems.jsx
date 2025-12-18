import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import SalesOrderItemForm from './SalesOrderItemForm';
import { salesOrderItemsAPI } from '../../services/api';

const SalesOrderItems = () => {
  const columns = [
    { label: 'Item ID', field: 'so_item_id' },
    { label: 'SO ID', field: 'soid' }, // Changed from 'so_id' to 'soid'
    { label: 'Product Type ID', field: 'product_type_id' },
    { 
      label: 'Quantity', 
      field: 'quantity', // Changed from 'quantity_sold' to 'quantity'
      render: (row) => row.quantity.toLocaleString()
    },
    { 
      label: 'Unit Price', 
      field: 'unit_price',
      render: (row) => '$' + row.unit_price.toFixed(2)
    },
    { 
      label: 'Discount', 
      field: 'discount',
      render: (row) => '$' + row.discount.toFixed(2)
    },
    { 
      label: 'Subtotal', 
      field: 'subtotal', // Use 'subtotal' from backend
      render: (row) => '$' + row.subtotal.toFixed(2)
    },
  ];

  return (
    <GenericCRUD
      title="Sales Order Items"
      subtitle="Manage line items for sales orders"
      apiService={salesOrderItemsAPI}
      columns={columns}
      FormComponent={SalesOrderItemForm}
      idField="so_item_id"
      searchFields={[]}
    />
  );
};

export default SalesOrderItems;