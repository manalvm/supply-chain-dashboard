import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import InvoiceForm from './InvoiceForm';
import { invoicesAPI } from '../../services/api';

const Invoices = () => {
  const columns = [
    { label: 'Invoice ID', field: 'invoice_id' },
    { label: 'SO ID', field: 'soid' }, // Changed from 'so_id' to 'soid'
    { 
      label: 'Issue Date', 
      field: 'invoice_date', // Changed from 'issue_date' to 'invoice_date'
      render: (row) => new Date(row.invoice_date).toLocaleDateString()
    },
    { 
      label: 'Due Date', 
      field: 'due_date',
      render: (row) => new Date(row.due_date).toLocaleDateString()
    },
    { 
      label: 'Total Amount', 
      field: 'total_amount',
      render: (row) => '$' + row.total_amount.toLocaleString(undefined, {minimumFractionDigits: 2})
    },
    { 
      label: 'Tax', 
      field: 'tax',
      render: (row) => '$' + row.tax.toLocaleString(undefined, {minimumFractionDigits: 2})
    },
    { 
      label: 'Currency', 
      field: 'currency'
    },
    { 
      label: 'Status', 
      field: 'status', // Changed from 'payment_status' to 'status'
      render: (row) => {
        const colors = {
          'Unpaid': 'error',
          'Partially Paid': 'warning',
          'Paid': 'success',
          'Overdue': 'error'
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
      title="Invoices"
      subtitle="Manage invoices and billing"
      apiService={invoicesAPI}
      columns={columns}
      FormComponent={InvoiceForm}
      idField="invoice_id"
      searchFields={['status']} // Changed from 'payment_status' to 'status'
    />
  );
};

export default Invoices;