const express = require("express");
const { runPuppeteerScript } = require("./scrapeLogic"); // Assuming runPuppeteerScript is the function you want to run
const app = express();

const PORT = process.env.PORT || 4000;

app.get("/scrape", async (req, res) => {
  const url = req.query.url; // Extract the URL from the query string

  if (!url) {
    return res.status(400).send("URL query parameter is required.");
  }

  try {
    const result = await runPuppeteerScript(url); // Run the Puppeteer script with the URL
    res.send(result); // Send the result back to the client
  } catch (error) {
    console.error("Error running Puppeteer script:", error);
    res.status(500).send("An error occurred while scraping the URL.");
  }
});

app.get("/", (req, res) => {
  res.send("Render Puppeteer server is up and running!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
