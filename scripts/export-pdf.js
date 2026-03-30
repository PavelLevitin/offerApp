'use strict';

const puppeteer = require('puppeteer');
const { createServer } = require('net');
const { spawn } = require('child_process');
const path = require('path');

const REPORT_DIR = path.resolve(__dirname, '../reports/allure-report');
const OUTPUT_PDF = path.resolve(__dirname, '../reports/allure-report.pdf');

function getFreePort() {
  return new Promise((resolve, reject) => {
    const srv = createServer();
    srv.listen(0, () => {
      const { port } = srv.address();
      srv.close(() => resolve(port));
    });
    srv.on('error', reject);
  });
}

function startServer(port) {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      'node',
      [require.resolve('serve/build/main'), REPORT_DIR, '--listen', port, '--no-clipboard'],
      { stdio: 'pipe' }
    );

    proc.stderr.on('data', (d) => process.stderr.write(d));

    let ready = false;
    proc.stdout.on('data', (d) => {
      if (!ready) {
        ready = true;
        resolve(proc);
      }
    });

    proc.on('error', reject);

    // Fallback: resolve after 2 s if no stdout
    setTimeout(() => {
      if (!ready) { ready = true; resolve(proc); }
    }, 2000);
  });
}

async function main() {
  const port = await getFreePort();
  console.log(`Starting server on port ${port}…`);
  const server = await startServer(port);

  const browser = await puppeteer.launch({ headless: 'new' });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    const url = `http://localhost:${port}`;
    console.log(`Loading ${url}…`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });

    // Give the React SPA a moment to fully render
    await new Promise((r) => setTimeout(r, 2000));

    console.log(`Printing PDF → ${OUTPUT_PDF}`);
    await page.pdf({
      path: OUTPUT_PDF,
      format: 'A4',
      landscape: true,
      printBackground: true,
      margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' },
    });

    console.log('Done.');
  } finally {
    await browser.close();
    server.kill();
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
