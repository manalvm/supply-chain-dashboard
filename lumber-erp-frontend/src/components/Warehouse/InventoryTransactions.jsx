import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import GenericCRUD from '../Shared/GenericCRUD';
import InventoryTransactionForm from './InventoryTransactionForm';
import { inventoryTransactionsAPI } from '../../services/api';

const InventoryTransactions = () => {
  const columns = [
    { label: 'Transaction ID', field: 'transaction_id' },
    { label: 'Stock ID', field: 'stock_id' },
    { 
      label: 'Transaction Type', 
      field: 'transaction_type',
      render: (row) => (
        <span className={`badge badge-${
          row.transaction_type === 'IN' ? 'success' : 
          row.transaction_type === 'OUT' ? 'warning' : 'info'
        }`}>
          {row.transaction_type}
        </span>
      )
    },
    { 
      label: 'Quantity', 
      field: 'quantity',
      render: (row) => row.quantity != null ? row.quantity.toLocaleString() : 'N/A'
    },
    { 
      label: 'Transaction Date', 
      field: 'transaction_date',
      render: (row) => row.transaction_date ? new Date(row.transaction_date).toLocaleDateString() : 'N/A'
    },
    { label: 'Reference', field: 'reference_id' },
  ];

  return (
    <GenericCRUD
      title="Inventory Transactions"
      subtitle="Track all inventory movements"
      apiService={inventoryTransactionsAPI}
      columns={columns}
      FormComponent={InventoryTransactionForm}
      idField="transaction_id"
      searchFields={['transaction_type', 'reference_id']}
    />
  );
};

export default InventoryTransactions;