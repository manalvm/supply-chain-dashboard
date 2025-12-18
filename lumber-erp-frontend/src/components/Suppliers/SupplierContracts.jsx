import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import SupplierContractForm from './SupplierContractForm';
import { supplierContractsAPI } from '../../services/api';

const SupplierContracts = () => {
  const columns = [
    { label: 'Contract ID', field: 'contract_id' },
    { label: 'Supplier ID', field: 'supplier_id' },
    { 
      label: 'Start Date', 
      field: 'start_date',
      render: (row) => new Date(row.start_date).toLocaleDateString()
    },
    { 
      label: 'End Date', 
      field: 'end_date',
      render: (row) => new Date(row.end_date).toLocaleDateString()
    },
    { 
      label: 'Contract Value', 
      field: 'contract_value',
      render: (row) => '$' + row.contract_value.toLocaleString()
    },
    { 
      label: 'Status', 
      field: 'status',
      render: (row) => (
        <span className={`badge badge-${row.status === 'Active' ? 'success' : 'warning'}`}>
          {row.status}
        </span>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Supplier Contracts"
      subtitle="Manage supplier agreements and terms"
      apiService={supplierContractsAPI}
      columns={columns}
      FormComponent={SupplierContractForm}
      idField="contract_id"
      searchFields={['status']}
    />
  );
};

export default SupplierContracts;