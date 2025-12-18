import React from 'react';
import GenericCRUD from '../Shared/GenericCRUD';
import TreeSpeciesForm from './TreeSpeciesForm';
import { treeSpeciesAPI } from '../../services/api';

const TreeSpeciesList = () => {
  const columns = [
    { label: 'ID', field: 'species_id' },
    { label: 'Species Name', field: 'species_name' },
    { label: 'Avg Height (ft)', field: 'average_height' },
    { label: 'Density (kg/m³)', field: 'density' },
    { label: 'Moisture %', field: 'moisture_content' },
    { label: 'Grade', field: 'grade' },
  ];

  return (
    <GenericCRUD
      title="Tree Species"
      subtitle="Manage tree species characteristics"
      apiService={treeSpeciesAPI}
      columns={columns}
      FormComponent={TreeSpeciesForm}
      idField="species_id"
      searchFields={['species_name', 'grade']}
    />
  );
};

export default TreeSpeciesList;