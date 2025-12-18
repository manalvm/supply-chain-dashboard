import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import QualityInspectionForm from './QualityInspectionForm';
import { qualityInspectionsAPI } from '../../services/api';

const QualityInspections = () => {
  const columns = [
    { label: 'Inspection ID', field: 'inspection_id' },
    { label: 'Employee ID', field: 'employee_id' },
    { label: 'Batch ID', field: 'batch_id' },
    { 
      label: 'Date', 
      field: 'date',
      render: (row) => row.date ? new Date(row.date).toLocaleDateString() : 'N/A'
    },
    { 
      label: 'Result', 
      field: 'result',
      render: (row) => (
        <span className={`badge badge-${row.result === 'Pass' ? 'success' : 'error'}`}>
          {row.result}
        </span>
      )
    },
    { 
      label: 'Moisture Level', 
      field: 'moisture_level',
      render: (row) => row.moisture_level != null ? `${row.moisture_level.toFixed(2)}%` : 'N/A'
    },
    { label: 'Certification', field: 'certification_id' },
  ];

  return (
    <GenericCRUD
      title="Quality Inspections"
      subtitle="Monitor product quality and defects"
      apiService={qualityInspectionsAPI}
      columns={columns}
      FormComponent={QualityInspectionForm}
      idField="inspection_id"
      searchFields={['result', 'certification_id']}
    />
  );
};

export default QualityInspections;  