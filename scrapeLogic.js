const puppeteer = require("puppeteer");
require("dotenv").config();

const runPuppeteerScript = async (url) => {
  try {
    if (!url) {
      console.error('URL is required');
      process.exit(1);
    }

    // Extract the fragment from the URL
    const pathFragment = new URL(url).hash.split('/')[1];
    const targetUrl = `https://hamsterkombatgame.io/clicker/${pathFragment}`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    let authToken = null;

    // Navigate to the target URL
    await page.goto(targetUrl);

    // Intercept network requests
    page.on('request', request => {
      const requestUrl = request.url();
      if (requestUrl === 'https://api.hamsterkombatgame.io/clicker/sync') {
        const headers = request.headers();
        if (headers['authorization']) {
          authToken = headers['authorization'];
        }
      }
    });

    // Wait for the specific request
    await page.waitForRequest(request => request.url() === 'https://api.hamsterkombatgame.io/clicker/sync');

    // Close the browser
    await browser.close();

    // Output the extracted token
    console.log({ token: authToken || 'No token found' });
  } catch (error) {
    console.error('Error running Puppeteer script:', error);
    process.exit(1);
  }
};

  // Get the URL of the current page
    const currentUrl = window.location.href;

// Run the script with the provided URL
runPuppeteerScript(currentUrl);