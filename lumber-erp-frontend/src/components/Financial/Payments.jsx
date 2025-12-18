import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import PaymentForm from './PaymentForm';
import { paymentsAPI } from '../../services/api';

const Payments = () => {
  const columns = [
    { label: 'Payment ID', field: 'payment_id' },
    { label: 'Invoice ID', field: 'invoice_id' },
    { 
      label: 'Payment Date', 
      field: 'payment_date',
      render: (row) => new Date(row.payment_date).toLocaleDateString()
    },
    { 
      label: 'Amount', 
      field: 'amount', // Changed from 'amount_paid' to 'amount'
      render: (row) => '$' + row.amount.toLocaleString(undefined, {minimumFractionDigits: 2})
    },
    { 
      label: 'Payment Method', 
      field: 'method' // Changed from 'payment_method' to 'method'
    },
    { 
      label: 'Reference', 
      field: 'reference_no' // Changed from 'transaction_reference' to 'reference_no'
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => {
        const colors = {
          'Completed': 'success',
          'Pending': 'warning',
          'Failed': 'error',
          'Refunded': 'info'
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
      title="Payments"
      subtitle="Track and manage payment transactions"
      apiService={paymentsAPI}
      columns={columns}
      FormComponent={PaymentForm}
      idField="payment_id"
      searchFields={['method', 'reference_no', 'status']} // Updated search fields
    />
  );
};

export default Payments;