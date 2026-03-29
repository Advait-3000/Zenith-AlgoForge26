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

export const generatePDF = async (data: PDFTemplateData, skipShare: boolean = false): Promise<string> => {
  try {
    const htmlTemplate = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body { font-family: -apple-system, sans-serif; padding: 40px; color: #1f2937; }
          .container { max-width: 750px; margin: auto; background: #fff; padding: 32px; border: 1px solid #eee; border-radius: 20px; }
          .title { font-size: 28px; color: #3e9f8f; font-weight: bold; }
          .section { margin-top: 25px; }
          .section-title { font-size: 13px; color: #6b7280; text-transform: uppercase; margin-bottom: 10px; }
          .text { font-size: 14px; line-height: 1.6; }
          .list-item { margin-bottom: 8px; font-size: 14px; }
          .risk-pill { padding: 6px 14px; border-radius: 999px; font-weight: bold; }
          .risk-High { background: #ffe5e5; color: #dc2626; }
          .risk-Medium { background: #fff4e5; color: #d97706; }
          .risk-Low { background: #e6f7f3; color: #3e9f8f; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="title">Health Report</div>
          <p>${new Date().toLocaleDateString()}</p>
          <hr />
          <div class="section">
            <div class="section-title">Patient Info</div>
            <p><b>Name:</b> ${data.patient.name}</p>
            <p><b>Age:</b> ${data.patient.age}</p>
            <p><b>Gender:</b> ${data.patient.gender}</p>
          </div>
          <div class="section">
            <div class="section-title">Summary</div>
            <p class="text">${data.summary}</p>
          </div>
          <div class="section">
            <div class="section-title">Risk Level</div>
            <span class="risk-pill risk-${data.risk}">${data.healthScore} - ${data.risk}</span>
          </div>
          <div class="section">
            <div class="section-title">Recommendations</div>
            ${data.recommendations.map(r => `<div class="list-item">• ${r}</div>`).join('')}
          </div>
        </div>
      </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({
      html: htmlTemplate,
      base64: false
    });

    if (!skipShare && await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Share Health Report',
      });
    }

    return uri;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};
