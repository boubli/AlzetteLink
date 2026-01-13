/**
 * ExportButton Component
 * Provides dropdown UI for selecting export format
 */

import { useState, useRef, useEffect } from 'react';
import { useDataExport } from '../hooks/useDataExport';

export default function ExportButton({ data, machineId = 'machine-01' }) {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);
  const { exportData, isExporting, exportError, clearError } = useDataExport();

  useEffect(() => {
    function handleClickOutside(event) {
      if (buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleExport = (format) => {
    exportData(data, format, {
      machineId: machineId,
      fields: ['temp', 'status']
    });
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={buttonRef}>
      {/* Main Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting || !data || data.length === 0}
        className={`
          px-4 py-2 rounded-lg font-medium text-sm
          transition-all duration-200
          flex items-center gap-2
          ${
            isExporting || !data || data.length === 0
              ? 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50'
              : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
          }
        `}
      >
        <span>⬇️</span>
        {isExporting ? 'Exporting...' : 'Export Data'}
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-xl z-50 border border-slate-700">
          {/* CSV Option */}
          <button
            onClick={() => handleExport('csv')}
            className={`
              w-full text-left px-4 py-3 hover:bg-slate-700
              border-b border-slate-700 transition-colors
              flex items-center gap-2 text-white
              ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isExporting}
          >
            <span className="text-lg">📊</span>
            <div>
              <div className="font-medium">Export as CSV</div>
              <div className="text-xs text-slate-400">Spreadsheet format</div>
            </div>
          </button>

          {/* JSON Option */}
          <button
            onClick={() => handleExport('json')}
            className={`
              w-full text-left px-4 py-3 hover:bg-slate-700
              transition-colors
              flex items-center gap-2 text-white
              ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}
            `}
            disabled={isExporting}
          >
            <span className="text-lg">📄</span>
            <div>
              <div className="font-medium">Export as JSON</div>
              <div className="text-xs text-slate-400">With metadata</div>
            </div>
          </button>
        </div>
      )}

      {/* Error Message */}
      {exportError && (
        <div className="absolute top-full mt-2 right-0 bg-red-900/80 border border-red-700 text-red-200 px-4 py-2 rounded-lg text-sm max-w-xs z-50">
          <div className="flex justify-between items-start gap-2">
            <span>{exportError}</span>
            <button
              onClick={clearError}
              className="text-red-200 hover:text-red-100 font-bold"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
