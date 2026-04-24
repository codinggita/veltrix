import React from 'react';

const Table = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  return (
    <div className="w-full overflow-x-auto rounded-card border border-border-dark">
      <table className="w-full text-left border-collapse">
        <thead className="bg-bg-tertiary">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-bg-secondary divide-y divide-border-dark">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((_, j) => (
                  <td key={j} className="px-6 py-4">
                    <div className="h-4 bg-bg-tertiary rounded w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length > 0 ? (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-bg-tertiary/50 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className="px-6 py-4 text-sm text-text-primary">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-12 text-center text-text-muted italic"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
