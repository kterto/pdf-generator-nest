import { Injectable } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import React from "react";
import * as ReactDOMServer from "react-dom/server";
import ReportTemplate from "../../pdf-templates/report-template";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class PdfGeneratorService {
  async generateReportPdf(reportData: any): Promise<String> {
    try {
      console.log("Puppeteer executable path:", puppeteer.executablePath());
      console.log(`Opening headless browser...`);
      const browser = await puppeteer.launch({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        headless: "new",
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-gpu",
          "--disable-dev-shm-usage", // important in Docker
          "--disable-infobars",
          "--single-process",
          "--no-zygote",
        ],
        protocolTimeout: 60000, // increase timeout (default is 30s)
      });
      console.log(`Opened headless browser`);
      try {
        console.log(`Creating blank page...`);
        const page = await browser.newPage();
        console.log(`Created blank page.`);
        // Render React component to HTML
        const html = ReactDOMServer.renderToStaticMarkup(
          React.createElement(ReportTemplate, { data: reportData })
        );
        console.log(`Loaded React component.`);
        console.log(`Setting content to page...`);
        await page.setContent(html, { waitUntil: "networkidle0" });
        console.log(`Content set to page.`);
        console.log(`Creating pdf stream...`);
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
        console.log(`returning pdf stream`);

        // ✅ Ensure temp directory exists
        const tempDir = path.join(process.cwd(), "temp");
        if (!fs.existsSync(tempDir)) {
          fs.mkdirSync(tempDir);
        }

        // ✅ Create unique filename
        const filePath = path.join(tempDir, `report-${Date.now()}.pdf`);

        // ✅ Write buffer to file
        fs.writeFileSync(filePath, pdf);
        console.log(`PDF saved to ${filePath}`);

        // ✅ Return the path (to serve via controller)
        return filePath;
      } finally {
        await browser.close();
      }
    } catch (error) {
      console.log(`Failed to generate pdf with error ${error}`);
      throw error;
    }
  }
}
