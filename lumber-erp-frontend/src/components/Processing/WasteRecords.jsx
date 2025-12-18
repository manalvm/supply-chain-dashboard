import React from 'react';
import { Recycle } from 'lucide-react';
import GenericCRUD from '../Shared/GenericCRUD';
import WasteRecordForm from './WasteRecordForm';
import { wasteRecordsAPI } from '../../services/api';

const WasteRecords = () => {
  const columns = [
    { label: 'Waste ID', field: 'waste_id' },
    { label: 'Processing ID', field: 'processing_id' },
    { label: 'Waste Type', field: 'waste_type' },
    { 
      label: 'Volume', 
      field: 'volume',
      render: (row) => row.volume.toLocaleString() + ' units'
    },
    { label: 'Disposal Method', field: 'disposal_method' },
    { 
      label: 'Recycled', 
      field: 'recycled',
      render: (row) => (
        <span className={`badge badge-${row.recycled ? 'success' : 'warning'}`}>
          {row.recycled ? <Recycle size={12} /> : null}
          {row.recycled ? 'Yes' : 'No'}
        </span>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Waste Records"
      subtitle="Track waste management and recycling"
      apiService={wasteRecordsAPI}
      columns={columns}
      FormComponent={WasteRecordForm}
      idField="waste_id"
      searchFields={['waste_type', 'disposal_method']}
    />
  );
};

export default WasteRecords;