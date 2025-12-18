import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import ProcessingOrderForm from './ProcessingOrderForm';
import { processingOrdersAPI } from '../../services/api';

const ProcessingOrders = () => {
  const columns = [
    { label: 'Processing ID', field: 'processing_id' },
    { label: 'Product Type ID', field: 'product_type_id' },
    { label: 'Unit ID', field: 'unit_id' },
    { 
      label: 'Start Date', 
      field: 'start_date',
      render: (row) => new Date(row.start_date).toLocaleDateString()
    },
    { 
      label: 'End Date', 
      field: 'end_date',
      render: (row) => row.end_date ? new Date(row.end_date).toLocaleDateString() : 'N/A'
    },
    { 
      label: 'Output', 
      field: 'output_quantity',
      render: (row) => row.output_quantity.toLocaleString()
    },
    { 
      label: 'Efficiency', 
      field: 'efficiency_rate',
      render: (row) => row.efficiency_rate + '%'
    },
  ];

  return (
    <GenericCRUD
      title="Processing Orders"
      subtitle="Track production orders and output"
      apiService={processingOrdersAPI}
      columns={columns}
      FormComponent={ProcessingOrderForm}
      idField="processing_id"
      searchFields={[]}
    />
  );
};

export default ProcessingOrders;