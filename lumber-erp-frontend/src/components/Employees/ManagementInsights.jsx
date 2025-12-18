import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import ManagementInsightForm from './ManagementInsightForm';
import { managementInsightsAPI } from '../../services/api';

const ManagementInsights = () => {
  const columns = [
    { label: 'Report ID', field: 'report_id' },
    { label: 'Employee ID', field: 'employee_id' },
    { label: 'KPI Type', field: 'kpi_type' },
    { label: 'Time Period', field: 'time_period' },
  ];

  return (
    <GenericCRUD
      title="Management Insights"
      subtitle="Track KPIs and performance metrics"
      apiService={managementInsightsAPI}
      columns={columns}
      FormComponent={ManagementInsightForm}
      idField="report_id"
      searchFields={['kpi_type', 'time_period']}
    />
  );
};

export default ManagementInsights;