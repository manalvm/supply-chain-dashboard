import React from 'react';
import { QrCode } from 'lucide-react';
import GenericCRUD from '../Shared/GenericCRUD';
import HarvestBatchForm from './HarvestBatchForm';
import { harvestBatchesAPI } from '../../services/api';

const HarvestBatches = () => {
  const columns = [
    { label: 'Batch ID', field: 'batch_id' },
    { label: 'Forest ID', field: 'forest_id' },
    { label: 'Species ID', field: 'species_id' },
    { 
      label: 'Quantity', 
      field: 'quantity',
      render: (row) => row.quantity.toLocaleString() + ' units'
    },
    { 
      label: 'Harvest Date', 
      field: 'harvest_date',
      render: (row) => new Date(row.harvest_date).toLocaleDateString()
    },
    { label: 'Quality', field: 'quality_indicator' },
    { 
      label: 'QR Code', 
      field: 'qr_code',
      render: (row) => (
        <div className="qr-code-cell">
          <QrCode size={16} />
          {row.qr_code}
        </div>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Harvest Batches"
      subtitle="Track harvested timber batches"
      apiService={harvestBatchesAPI}
      columns={columns}
      FormComponent={HarvestBatchForm}
      idField="batch_id"
      searchFields={['qr_code', 'quality_indicator']}
    />
  );
};

export default HarvestBatches;