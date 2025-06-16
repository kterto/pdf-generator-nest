import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import * as React from "react";
import * as ReactDOMServer from "react-dom/server";
import ReportTemplate from "../../pdf-templates/report-template";

@Injectable()
export class PdfGeneratorService {
  async generateReportPdf(reportData: any): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();

      // Render React component to HTML
      const html = ReactDOMServer.renderToStaticMarkup(
        React.createElement(ReportTemplate, { data: reportData })
      );

      await page.setContent(html, { waitUntil: "networkidle0" });

      const pdf = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });

      return pdf;
    } finally {
      await browser.close();
    }
  }
}
