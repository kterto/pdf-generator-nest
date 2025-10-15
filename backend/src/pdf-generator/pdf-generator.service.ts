import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import * as puppeteer from "puppeteer";
import React from "react";
import * as ReactDOMServer from "react-dom/server";
import ReportTemplate from "../../pdf-templates/report-template";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class PdfGeneratorService implements OnModuleInit, OnModuleDestroy {
  private browser: puppeteer.Browser | null = null;

  async onModuleInit() {
    console.log("🚀 Launching Puppeteer...");
    this.browser = await puppeteer.launch({
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--disable-infobars",
        "--single-process",
        "--no-zygote",
      ],
      protocolTimeout: 60000,
    });
    console.log("✅ Puppeteer ready");
  }

  async onModuleDestroy() {
    if (this.browser) {
      await this.browser.close();
      console.log("🧹 Puppeteer closed");
    }
  }

  async generateReportPdf(reportData: any): Promise<string> {
    if (!this.browser) throw new Error("Puppeteer not initialized");
    console.log(`Creating blank page...`);
    const page = await this.browser.newPage();
    try {
      console.log(`Created blank page.`);
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
      const tempDir = path.join(process.cwd(), "temp");
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }

      const filePath = path.join(tempDir, `report-${Date.now()}.pdf`);
      fs.writeFileSync(filePath, pdf);
      console.log(`PDF saved to ${filePath}`);
      return filePath;
    } finally {
      await page.close(); // ✅ avoid leaks
    }
  }
}
