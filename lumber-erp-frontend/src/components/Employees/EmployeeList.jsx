import React from 'react';
import { Star } from 'lucide-react';
import GenericCRUD from '../Shared/GenericCRUD';
import EmployeeForm from './EmployeeForm';
import { employeesAPI } from '../../services/api';

const EmployeeList = () => {
  const columns = [
    { label: 'ID', field: 'employee_id' },
    { label: 'Full Name', field: 'full_name' },
    { label: 'Department', field: 'department' },
    { label: 'Position', field: 'position' },
    { 
      label: 'Hire Date', 
      field: 'hire_date',
      render: (row) => new Date(row.hire_date).toLocaleDateString()
    },
    { 
      label: 'Performance', 
      field: 'performance_rating',
      render: (row) => (
        <div className="rating-cell">
          <Star size={14} fill="var(--accent-orange)" color="var(--accent-orange)" />
          {row.performance_rating ? row.performance_rating.toFixed(1) : 'N/A'}
        </div>
      )
    },
  ];

  return (
    <GenericCRUD
      title="Employees"
      subtitle="Manage your workforce and employee records"
      apiService={employeesAPI}
      columns={columns}
      FormComponent={EmployeeForm}
      idField="employee_id"
      searchFields={['full_name', 'department', 'position']}
    />
  );
};

export default EmployeeList;