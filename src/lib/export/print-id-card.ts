/**
 * CampusLens AI - Student Digital ID Print & Export Utility
 */

export interface StudentCardExportData {
  fullName: string;
  studentId: string;
  rollNumber: string;
  department: string;
  academicYear: string;
  division: string;
  collegeName: string;
  validThrough: string;
}

export function printStudentIdCard(data: StudentCardExportData): void {
  if (typeof window === "undefined") return;

  const printWindow = window.open("", "_blank", "width=600,height=750");
  if (!printWindow) return;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Student ID Badge - ${data.fullName}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: #f1f5f9;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          margin: 0;
          padding: 20px;
        }
        .badge {
          width: 340px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          overflow: hidden;
          border: 1px solid #e2e8f0;
          text-align: center;
        }
        .badge-header {
          background: linear-gradient(135deg, #1e3a8a, #3b82f6);
          color: #ffffff;
          padding: 24px 16px;
        }
        .badge-header h2 { margin: 0; font-size: 16px; letter-spacing: 0.5px; }
        .badge-header p { margin: 4px 0 0; font-size: 11px; opacity: 0.85; }
        .badge-body { padding: 24px 20px; }
        .avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: #e2e8f0;
          margin: -60px auto 16px;
          border: 4px solid #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          color: #1e3a8a;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .name { font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 4px; }
        .dept { font-size: 12px; font-weight: 600; color: #2563eb; margin: 0 0 16px; }
        .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; text-align: left; }
        .meta-table td { padding: 6px 8px; font-size: 11px; border-bottom: 1px solid #f1f5f9; }
        .meta-table .label { color: #64748b; font-weight: 500; }
        .meta-table .val { color: #0f172a; font-weight: 700; text-align: right; }
        .qr-placeholder {
          background: #f8fafc;
          border: 1px dashed #cbd5e1;
          border-radius: 12px;
          padding: 12px;
          font-size: 11px;
          color: #475569;
          font-family: monospace;
          letter-spacing: 1px;
        }
        .badge-footer {
          background: #f8fafc;
          padding: 12px;
          font-size: 10px;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
        }
        @media print {
          body { background: transparent; padding: 0; }
          .badge { box-shadow: none; }
        }
      </style>
    </head>
    <body>
      <div class="badge">
        <div class="badge-header">
          <h2>${data.collegeName}</h2>
          <p>Official Institutional Digital ID</p>
        </div>
        <div class="badge-body">
          <div class="avatar">${data.fullName.charAt(0)}</div>
          <h1 class="name">${data.fullName}</h1>
          <p class="dept">${data.department} • ${data.academicYear}</p>
          <table class="meta-table">
            <tr><td class="label">Roll Number</td><td class="val">${data.rollNumber}</td></tr>
            <tr><td class="label">Division / Batch</td><td class="val">${data.division}</td></tr>
            <tr><td class="label">Student UID</td><td class="val">${data.studentId.substring(0, 13)}...</td></tr>
            <tr><td class="label">Valid Through</td><td class="val">${data.validThrough}</td></tr>
          </table>
          <div class="qr-placeholder">
            [RFID-NFC VERIFIED • ${data.rollNumber}]
          </div>
        </div>
        <div class="badge-footer">
          CampusLens AI Verified • Property of ${data.collegeName}
        </div>
      </div>
      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
