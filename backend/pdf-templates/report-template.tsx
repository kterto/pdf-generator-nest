import React from 'react';

interface ReportData {
  status: string;
  totalOccurrences: number;
  occurrences: Array<{
    id: number;
    created_at: string;
    created_by: string;
    closed_at: string | null;
    description: string;
    status: string;
  }>;
  dateRange: {
    start: string;
    end: string;
  };
}

const ReportTemplate: React.FC<{ data: ReportData }> = ({ data }) => {
  return (
    <html>
      <head>
        <title>Occurrences Report</title>
        <style>{`
          body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .summary {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
          }
          th {
            background-color: #4CAF50;
            color: white;
          }
          tr:nth-child(even) {
            background-color: #f2f2f2;
          }
          .status-open { color: #ff9800; font-weight: bold; }
          .status-closed { color: #4caf50; font-weight: bold; }
          .status-abandoned { color: #f44336; font-weight: bold; }
        `}</style>
      </head>
      <body>
        <div className="header">
          <h1>Occurrences Report</h1>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="summary">
          <h2>Report Summary</h2>
          <p><strong>Status Filter:</strong> {data.status}</p>
          <p><strong>Total Occurrences:</strong> {data.totalOccurrences}</p>
          <p><strong>Date Range:</strong> {data.dateRange.start} to {data.dateRange.end}</p>
        </div>

        <h2>Occurrences Details</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Created At</th>
              <th>Created By</th>
              <th>Closed At</th>
              <th>Description</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.occurrences.map((occurrence) => (
              <tr key={occurrence.id}>
                <td>{occurrence.id}</td>
                <td>{new Date(occurrence.created_at).toLocaleDateString()}</td>
                <td>{occurrence.created_by}</td>
                <td>{occurrence.closed_at ? new Date(occurrence.closed_at).toLocaleDateString() : '-'}</td>
                <td>{occurrence.description}</td>
                <td className={`status-${occurrence.status}`}>
                  {occurrence.status.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </body>
    </html>
  );
};

export default ReportTemplate;