import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import CustomerForm from './CustomerForm';
import { customersAPI } from '../../services/api';

const CustomerList = () => {
  const columns = [
    { label: 'Customer ID', field: 'customer_id' },
    { label: 'Name', field: 'name' }, // Changed from company_name to name
    { 
      label: 'Retailer', 
      field: 'retailer',
      render: (row) => row.retailer ? 'Yes' : 'No'
    },
    { 
      label: 'End User', 
      field: 'end_user',
      render: (row) => row.end_user ? 'Yes' : 'No'
    },
    { label: 'Contact Info', field: 'contact_info' }, // Changed from separate email/phone
    { label: 'Address', field: 'address' },
    { label: 'Tax Number', field: 'tax_number' }, // Changed from credit_limit
  ];

  return (
    <GenericCRUD
      title="Customers"
      subtitle="Manage customer relationships and contacts"
      apiService={customersAPI}
      columns={columns}
      FormComponent={CustomerForm}
      idField="customer_id"
      searchFields={['name', 'contact_info']} // Updated search fields
    />
  );
};

export default CustomerList;