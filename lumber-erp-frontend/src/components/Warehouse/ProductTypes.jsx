import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import ProductTypeForm from './ProductTypeForm';
import { productTypesAPI } from '../../services/api';

const ProductTypes = () => {
 const columns = [
  { label: 'Type ID', field: 'product_type_id' },
  { label: 'Name', field: 'product_name' },
  { label: 'Category', field: 'category' },
  { 
    label: 'Unit Price', 
    field: 'unit_price',
    render: (row) => row.unit_price != null ? `$${row.unit_price.toFixed(2)}` : 'N/A'
  },
  { label: 'Unit of Measure', field: 'unit_of_measure' },
];

  return (
    <GenericCRUD
      title="Product Types"
      subtitle="Manage product categories and specifications"
      apiService={productTypesAPI}
      columns={columns}
      FormComponent={ProductTypeForm}
      idField="product_type_id"
      searchFields={['product_name', 'category']}
    />
  );
};

export default ProductTypes;