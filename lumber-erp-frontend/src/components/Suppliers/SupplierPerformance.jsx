import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import SupplierPerformanceForm from './SupplierPerformanceForm';
import { supplierPerformanceAPI } from '../../services/api';

const SupplierPerformance = () => {
  const columns = [
    { label: 'Performance ID', field: 'performance_id' },
    { label: 'Supplier ID', field: 'supplier_id' },
    { 
      label: 'Rating', 
      field: 'rating',
      render: (row) => '⭐ ' + row.rating.toFixed(1)
    },
    { 
      label: 'Delivery %', 
      field: 'delivery_timeliness',
      render: (row) => row.delivery_timeliness.toFixed(1) + '%'
    },
    { 
      label: 'Quality %', 
      field: 'quality_score',
      render: (row) => row.quality_score.toFixed(1) + '%'
    },
    { 
      label: 'Review Date', 
      field: 'review_date',
      render: (row) => new Date(row.review_date).toLocaleDateString()
    },
  ];

  return (
    <GenericCRUD
      title="Supplier Performance"
      subtitle="Monitor and evaluate supplier metrics"
      apiService={supplierPerformanceAPI}
      columns={columns}
      FormComponent={SupplierPerformanceForm}
      idField="performance_id"
      searchFields={[]}
    />
  );
};

export default SupplierPerformance;