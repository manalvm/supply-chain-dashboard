import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import WarehouseForm from './WarehouseForm';
import { warehousesAPI } from '../../services/api';

const WarehouseList = () => {
  const columns = [
    { label: 'ID', field: 'warehouse_id' },
    { label: 'Name', field: 'name' },
    { label: 'Location', field: 'location' },
    { 
      label: 'Capacity', 
      field: 'capacity',
      render: (row) => row.capacity.toLocaleString() + ' units'
    },
    { 
      label: 'Current Stock', 
      field: 'current_stock_level',
      render: (row) => row.current_stock_level ? row.current_stock_level.toLocaleString() : '0'
    },
  ];

  return (
    <GenericCRUD
      title="Warehouses"
      subtitle="Manage warehouse locations and capacity"
      apiService={warehousesAPI}
      columns={columns}
      FormComponent={WarehouseForm}
      idField="warehouse_id"
      searchFields={['name', 'location']}
    />
  );
};

export default WarehouseList;