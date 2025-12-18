import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import WorkerAssignmentForm from './WorkerAssignmentForm';
import { workerAssignmentsAPI } from '../../services/api';

const WorkerAssignments = () => {
  const columns = [
    { label: 'ID', field: 'assignment_id' },
    { label: 'Employee ID', field: 'employee_id' },
    { label: 'Processing ID', field: 'processing_id' },
    { label: 'Role in Task', field: 'role_in_task' },
    { label: 'Notes', field: 'notes' },
  ];

  return (
    <GenericCRUD
      title="Worker Assignments"
      subtitle="Manage employee task assignments"
      apiService={workerAssignmentsAPI}
      columns={columns}
      FormComponent={WorkerAssignmentForm}
      idField="assignment_id"
      searchFields={['role_in_task', 'notes']}
    />
  );
};

export default WorkerAssignments;