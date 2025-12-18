import React from 'react';
import { Plus } from 'lucide-react';
import './Shared.css';

const PageHeader = ({ title, subtitle, onAdd, addLabel = "Add New" }) => {
  return (
    <div className="page-header">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-subtitle">{subtitle}</p>}
      </div>
      {onAdd && (
        <button className="btn btn-primary" onClick={onAdd}>
          <Plus size={18} />
          {addLabel}
        </button>
      )}
    </div>
  );
};

export default PageHeader;