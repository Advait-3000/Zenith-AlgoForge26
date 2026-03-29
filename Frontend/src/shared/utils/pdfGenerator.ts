import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

export interface PDFTemplateData {
  patient: {
    name: string;
    age: string;
    gender: string;
  };
  summary: string;
  findings: string[];
  explanation: string;
  risk: "Low" | "Medium" | "High";
  healthScore: string;
  recommendations: string[];
}

export const generatePDF = async (data: PDFTemplateData) => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f4f8f7;
            padding: 40px;
            color: #1f2937;
          }

          .container {
            max-width: 750px;
            margin: auto;
            background: #ffffff;
            border-radius: 20px;
            padding: 32px;
          }

          .header {
            margin-bottom: 30px;
          }

          .title {
            font-size: 28px;
            font-weight: 700;
            color: #3e9f8f;
          }

          .date {
            font-size: 13px;
            color: #9ca3af;
            margin-top: 4px;
          }

          .divider {
            height: 1px;
            background: #e5e7eb;
            margin: 20px 0;
          }

          .grid {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }

          .info {
            flex: 1;
          }

          .label {
            font-size: 12px;
            color: #9ca3af;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .value {
            font-size: 15px;
            font-weight: 600;
            margin-top: 4px;
          }

          .section {
            margin-bottom: 28px;
          }

          .section-title {
            font-size: 13px;
            color: #6b7280;
            font-weight: 600;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .text {
            font-size: 14px;
            line-height: 1.6;
            color: #374151;
          }

          .list {
            margin-top: 8px;
          }

          .list-item {
            font-size: 14px;
            margin-bottom: 8px;
            color: #374151;
            line-height: 1.5;
          }

          .pill {
            display: inline-block;
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 600;
            margin-top: 6px;
          }

          .low {
            background: #e6f7f3;
            color: #3e9f8f;
          }

          .medium {
            background: #fff4e5;
            color: #d97706;
          }

          .high {
            background: #ffe5e5;
            color: #dc2626;
          }

          .footer {
            margin-top: 40px;
            font-size: 12px;
            text-align: center;
            color: #9ca3af;
          }
        </style>
      </head>

      <body>
      <div class="container">
        <!-- HEADER -->
        <div class="header">
          <div class="title">Cura Health Report</div>
          <div class="date">${new Date().toLocaleDateString()}</div>
        </div>

        <div class="divider"></div>

        <!-- PATIENT INFO -->
        <div class="grid">
          <div class="info">
            <div class="label">Patient</div>
            <div class="value">${data.patient?.name || "N/A"}</div>
          </div>

          <div class="info">
            <div class="label">Age</div>
            <div class="value">${data.patient?.age || "N/A"}</div>
          </div>

          <div class="info">
            <div class="label">Gender</div>
            <div class="value">${data.patient?.gender || "N/A"}</div>
          </div>
        </div>

        <!-- SUMMARY -->
        <div class="section">
          <div class="section-title">Executive Summary</div>
          <div class="text">
            ${data.summary || "No summary provided."}
          </div>
        </div>

        <!-- FINDINGS -->
        <div class="section">
          <div class="section-title">Key Findings</div>
          <div class="list">
            ${
              data.findings?.length
                ? data.findings.map(f => `<div class="list-item">• ${f}</div>`).join('')
                : "<div class='text'>No abnormalities detected.</div>"
            }
          </div>
        </div>

        <!-- LAYMAN -->
        <div class="section">
          <div class="section-title">Layman Explanation</div>
          <div class="text">
            ${data.explanation || "No explanation available."}
          </div>
        </div>

        <!-- HEALTH SCORE -->
        <div class="section">
          <div class="section-title">Health Score</div>
          <div class="pill ${
            data.risk === "High" ? "high" :
            data.risk === "Medium" ? "medium" :
            "low"
          }">
            ${data.healthScore || "N/A"}
          </div>
        </div>

        <!-- FACTORS -->
        <div class="section">
          <div class="section-title">Factors & Recommendations</div>
          <div class="list">
            ${
              data.recommendations?.length
                ? data.recommendations.map(r => `<div class="list-item">• ${r}</div>`).join('')
                : "<div class='text'>No clinical data available.</div>"
            }
          </div>
        </div>

        <!-- FOOTER -->
        <div class="footer">
          Generated by Cura AI • This report is not a substitute for professional medical advice
        </div>

      </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlTemplate,
      base64: false
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Cura Health Report',
        UTI: 'com.adobe.pdf',
      });
    } else {
      Alert.alert('Sharing not available', 'Unable to share or save the document on this device.');
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    Alert.alert('Download Error', 'Could not generate the PDF report.');
  }
};
