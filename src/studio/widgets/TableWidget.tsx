import React, { useState } from 'react';
import { WidgetConfig } from '../schema/types';
import { Search, ArrowUpDown, Download, Filter } from 'lucide-react';

interface TableWidgetProps {
  config: WidgetConfig;
  data: any[];
}

export const TableWidget: React.FC<TableWidgetProps> = ({ config, data = [] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const tableConfig = config.tableConfig;
  if (!tableConfig) {
    return <div className="p-4 bg-slate-900 text-slate-400 text-sm">Table Config Missing</div>;
  }

  // Filter
  const filteredData = data.filter((row) =>
    Object.values(row).some((val) => String(val).toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Sort
  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortColumn) return 0;
    const valA = a[sortColumn];
    const valB = b[sortColumn];
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const formatCellValue = (val: any, format?: string) => {
    if (val === undefined || val === null) return '-';
    if (format === 'currency' && typeof val === 'number') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    }
    if (format === 'percent' && typeof val === 'number') {
      return `${val.toFixed(1)}%`;
    }
    if (format === 'badge') {
      let badgeStyle = 'bg-slate-800 text-slate-300';
      if (val === 'healthy' || val === 'active' || val === 'approved') badgeStyle = 'bg-emerald-950 text-emerald-300 border-emerald-800/50';
      if (val === 'at_risk' || val === 'submitted' || val === 'preconstruction') badgeStyle = 'bg-amber-950 text-amber-300 border-amber-800/50';
      if (val === 'critical' || val === 'expired' || val === 'rejected') badgeStyle = 'bg-rose-950 text-rose-300 border-rose-800/50';

      return (
        <span className={`px-2 py-0.5 text-xs rounded-full border capitalize font-medium ${badgeStyle}`}>
          {String(val).replace('_', ' ')}
        </span>
      );
    }
    return String(val);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h4 className="text-sm font-semibold text-slate-200">{config.title}</h4>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search matrix..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-cyan-500 w-36 sm:w-48"
            />
          </div>

          <button
            onClick={() => alert('Exporting CSV report...')}
            className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 rounded-md flex items-center gap-1 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-medium">
              {tableConfig.columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className="py-2 px-3 cursor-pointer hover:text-slate-200 select-none"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.label}</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-600" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {sortedData.length === 0 ? (
              <tr>
                <td colSpan={tableConfig.columns.length} className="py-6 text-center text-slate-500">
                  No records match current filter criteria.
                </td>
              </tr>
            ) : (
              sortedData.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-slate-800/40 transition-colors">
                  {tableConfig.columns.map((col) => (
                    <td key={col.key} className="py-2.5 px-3 whitespace-nowrap">
                      {formatCellValue(row[col.key], col.format)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
