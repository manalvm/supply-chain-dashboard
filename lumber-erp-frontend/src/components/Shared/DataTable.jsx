import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import './Shared.css';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  onView,
  idField = 'id',
  loading = false 
}) => {
  if (loading) {
    return <div className="loading-spinner"></div>;
  }

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index}>{column.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 1} className="no-data">
                No data found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row[idField]}>
                {columns.map((column, index) => (
                  <td key={index}>
                    {column.render ? column.render(row) : row[column.field]}
                  </td>
                ))}
                <td>
                  <div className="action-buttons">
                    {onView && (
                      <button
                        className="btn btn-icon btn-secondary"
                        onClick={() => onView(row)}
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        className="btn btn-icon btn-secondary"
                        onClick={() => onEdit(row)}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className="btn btn-icon btn-danger"
                        onClick={() => onDelete(row[idField])}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;