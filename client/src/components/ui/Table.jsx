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
                className="px-6 py-16 text-center"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center text-text-muted mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary font-medium">{emptyMessage}</span>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
