import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import GenericCRUD from '../Shared/GenericCRUD';
import SupplierForm from './SupplierForm';
import { suppliersAPI } from '../../services/api';

const SupplierList = () => {
  const columns = [
    { label: 'ID', field: 'supplier_id' },
    { label: 'Company', field: 'company_name' },
    { label: 'Contact Person', field: 'contact_person' },
    { label: 'Email', field: 'email' },
    { label: 'Phone', field: 'phone' },
    { 
      label: 'Status', 
      field: 'compliance_status',
      render: (row) => (
        <span className={`badge badge-${row.compliance_status === 'Certified' ? 'success' : 'warning'}`}>
          {row.compliance_status}
        </span>
      )
    },
    { 
      label: 'Raw Materials', 
      field: 'raw',
      render: (row) => row.raw ? <CheckCircle size={16} color="green" /> : <XCircle size={16} color="gray" />
    },
    { 
      label: 'Semi-Processed', 
      field: 'semi_processed',
      render: (row) => row.semi_processed ? <CheckCircle size={16} color="green" /> : <XCircle size={16} color="gray" />
    },
  ];

  return (
    <GenericCRUD
      title="Suppliers"
      subtitle="Manage supplier relationships and contacts"
      apiService={suppliersAPI}
      columns={columns}
      FormComponent={SupplierForm}
      idField="supplier_id"
      searchFields={['company_name', 'contact_person', 'email']}
    />
  );
};

export default SupplierList;