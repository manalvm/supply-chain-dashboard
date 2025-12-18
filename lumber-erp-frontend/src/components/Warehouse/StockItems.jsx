import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import StockItemForm from './StockItemForm';
import { stockItemsAPI } from '../../services/api';

const StockItems = () => {
  const columns = [
    { label: 'Stock ID', field: 'stock_id' },
    { label: 'Warehouse ID', field: 'warehouse_id' },
    { label: 'Product Type ID', field: 'product_type_id' },
    { 
      label: 'Quantity', 
      field: 'quantity_in_stock',
      render: (row) => row.quantity_in_stock != null ? row.quantity_in_stock.toLocaleString() : 'N/A'
    },
    { 
      label: 'Shelf Location', 
      field: 'shelf_location'
    },
  ];

  return (
    <GenericCRUD
      title="Stock Items"
      subtitle="Track inventory stock levels"
      apiService={stockItemsAPI}
      columns={columns}
      FormComponent={StockItemForm}
      idField="stock_id"
      searchFields={[]}
    />
  );
};

export default StockItems;