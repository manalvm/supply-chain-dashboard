import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import TransportCompanyForm from './TransportCompanyForm';
import { transportCompaniesAPI } from '../../services/api';

const TransportCompanies = () => {
  const columns = [
    { label: 'Company ID', field: 'company_id' }, // Changed from transport_company_id
    { label: 'Company Name', field: 'company_name' },
    { label: 'Contact Info', field: 'contact_info' }, // Changed to match backend
    { label: 'License Number', field: 'license_number' }, // Changed from service_type
    { 
      label: 'Rating', 
      field: 'rating',
      render: (row) => (
        <span className="badge badge-info">
          {row.rating ? row.rating.toFixed(1) : 'N/A'}
        </span>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Transport Companies"
      subtitle="Manage logistics and transport partners"
      apiService={transportCompaniesAPI}
      columns={columns}
      FormComponent={TransportCompanyForm}
      idField="company_id" // Changed from transport_company_id
      searchFields={['company_name', 'contact_info']} // Updated search fields
    />
  );
};

export default TransportCompanies;