import React from 'react';

const Table = ({ columns = [], data = [], loading = false, emptyText = 'No data found.' }) => (
  <div className="table-wrapper">
    <table className="data-table">
      <thead>
        <tr>
          {columns.map((col, i) => (
            <th key={i} style={{ textAlign: col.align || 'left' }}>
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <tr key={i}>
              {columns.map((_, j) => (
                <td key={j}>
                  <div className="skeleton" style={{ height: 16, borderRadius: 4 }} />
                </td>
              ))}
            </tr>
          ))
        ) : data.length === 0 ? (
          <tr>
            <td colSpan={columns.length} style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--text-muted)' }}>
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((row, i) => (
            <tr key={row.id || i}>
              {columns.map((col, j) => (
                <td key={j} style={{ textAlign: col.align || 'left' }}>
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default Table;
