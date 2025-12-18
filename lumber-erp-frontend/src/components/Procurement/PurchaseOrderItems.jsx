import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import PurchaseOrderItemForm from './PurchaseOrderItemForm';
import { purchaseOrderItemsAPI } from '../../services/api';

const PurchaseOrderItems = () => {
  const columns = [
    { label: 'Item ID', field: 'po_item_id' },
    { label: 'PO ID', field: 'poid' }, // Changed from 'po_id' to 'poid'
    { label: 'Product Type ID', field: 'product_type_id' },
    { 
      label: 'Quantity', 
      field: 'quantity', // Changed from 'quantity_ordered' to 'quantity'
      render: (row) => row.quantity.toLocaleString()
    },
    { 
      label: 'Unit Price', 
      field: 'unit_price',
      render: (row) => '$' + row.unit_price.toFixed(2)
    },
    { 
      label: 'Total', 
      field: 'subtotal', // Use 'subtotal' from backend
      render: (row) => '$' + row.subtotal.toFixed(2)
    },
  ];

  return (
    <GenericCRUD
      title="Purchase Order Items"
      subtitle="Manage line items for purchase orders"
      apiService={purchaseOrderItemsAPI}
      columns={columns}
      FormComponent={PurchaseOrderItemForm}
      idField="po_item_id"
      searchFields={[]}
    />
  );
};

export default PurchaseOrderItems;