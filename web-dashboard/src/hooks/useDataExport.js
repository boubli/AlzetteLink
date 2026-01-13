/**
 * useDataExport Hook
 * Provides functions to export sensor data in CSV and JSON formats
 */

import { useState } from 'react';
import {
  convertToCSV,
  convertToJSON,
  downloadFile,
  generateFilename
} from '../utils/exportHelpers';

export function useDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);

  const exportAsCSV = (data, fields) => {
    try {
      setIsExporting(true);
      setExportError(null);

      const csvContent = convertToCSV(data, fields);
      const filename = generateFilename('csv');

      downloadFile(csvContent, filename, 'text/csv;charset=utf-8;');
      console.log(`CSV exported: ${filename}`);
    } catch (error) {
      setExportError(`Failed to export CSV: ${error.message}`);
      console.error('CSV Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAsJSON = (data, machineId) => {
    try {
      setIsExporting(true);
      setExportError(null);

      const jsonContent = convertToJSON(data, machineId);
      const filename = generateFilename('json');

      downloadFile(jsonContent, filename, 'application/json;charset=utf-8;');
      console.log(`JSON exported: ${filename}`);
    } catch (error) {
      setExportError(`Failed to export JSON: ${error.message}`);
      console.error('JSON Export Error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportData = (data, format = 'csv', options = {}) => {
    const { fields = ['temp', 'status'], machineId = 'machine-01' } = options;

    if (!data || data.length === 0) {
      setExportError('No data available to export');
      return;
    }

    if (format === 'csv') {
      exportAsCSV(data, fields);
    } else if (format === 'json') {
      exportAsJSON(data, machineId);
    } else {
      setExportError(`Unknown export format: ${format}`);
    }
  };

  return {
    exportData,
    exportAsCSV,
    exportAsJSON,
    isExporting,
    exportError,
    clearError: () => setExportError(null)
  };
}
