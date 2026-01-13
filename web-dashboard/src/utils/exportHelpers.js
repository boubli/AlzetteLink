/**
 * Helper functions for converting sensor data to different formats
 */

/**
 * Convert array of sensor readings to CSV format
 * @param {Array} data - Array of sensor reading objects
 * @param {Array} fields - Field names to include
 * @returns {string} CSV formatted string
 */
export function convertToCSV(data, fields = ['temp', 'status']) {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  // Create header row
  const headers = fields.join(',');

  // Create data rows
  const rows = data.map((item, index) => {
    return fields.map(field => {
      const value = item[field];

      if (value === undefined || value === null) {
        return '';
      }

      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }

      return value;
    }).join(',');
  });

  return [headers, ...rows].join('\n');
}

/**
 * Convert array of sensor readings to JSON format with metadata
 * @param {Array} data - Array of sensor reading objects
 * @param {string} machineId - Machine identifier
 * @returns {string} JSON formatted string
 */
export function convertToJSON(data, machineId = 'machine-01') {
  const exportData = {
    metadata: {
      machineId: machineId,
      exportDate: new Date().toISOString(),
      recordCount: data.length,
      exportedBy: 'AlzetteLink Dashboard'
    },
    data: data
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Trigger browser download of data
 * @param {string} content - File content to download
 * @param {string} filename - Filename for the downloaded file
 * @param {string} mimeType - MIME type of the file
 */
export function downloadFile(content, filename, mimeType = 'text/plain') {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate filename with timestamp
 * @param {string} format - File format (csv, json)
 * @returns {string} Filename with timestamp
 */
export function generateFilename(format = 'csv') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
  return `sensor-data-${timestamp}.${format}`;
}
