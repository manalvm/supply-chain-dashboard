import React from 'react';
import { AlertTriangle } from 'lucide-react';
import GenericCRUD from '../Shared/GenericCRUD';
import StockAlertForm from './StockAlertForm';
import { stockAlertsAPI } from '../../services/api';

const StockAlerts = () => {
  const columns = [
    { label: 'Alert ID', field: 'alert_id' },
    { label: 'Stock ID', field: 'stock_id' },
    { 
      label: 'Alert Type', 
      field: 'alert_type',
      render: (row) => (
        <span className={`badge badge-${row.alert_type === 'Low Stock' ? 'warning' : 'error'}`}>
          <AlertTriangle size={12} />
          {row.alert_type}
        </span>
      )
    },
    { 
      label: 'Triggered Date', 
      field: 'triggered_date',
      render: (row) => row.triggered_date ? new Date(row.triggered_date).toLocaleDateString() : 'N/A'
    },
    { 
      label: 'Resolved', 
      field: 'resolved',
      render: (row) => (
        <span className={`badge badge-${row.resolved ? 'success' : 'warning'}`}>
          {row.resolved ? 'Yes' : 'No'}
        </span>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Stock Alerts"
      subtitle="Monitor and manage inventory alerts"
      apiService={stockAlertsAPI}
      columns={columns}
      FormComponent={StockAlertForm}
      idField="alert_id"
      searchFields={['alert_type']}
    />
  );
};

export default StockAlerts;