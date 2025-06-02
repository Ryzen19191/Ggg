const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static('public'));

async function scrapeWingo() {
  const url = 'https://fantasygems.bio/#/';

  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the timer element to load - update selector as needed
  await page.waitForSelector('.game-timer');

  // Extract timer text
  const timerText = await page.$eval('.game-timer', el => el.textContent.trim());

  // Extract last results colors - update selector as needed
  const results = await page.$$eval('.results-list .result-color', nodes =>
    nodes.map(n => n.textContent.trim())
  );

  await browser.close();

  // Simple prediction logic example
  // Count occurrences of colors
  const counts = { RED: 0, GREEN: 0, VIOLET: 0 };
  results.forEach(color => {
    if (counts[color] !== undefined) counts[color]++;
  });

  // Predict color with minimum occurrence (just example)
  const prediction = Object.entries(counts).sort((a,b) => a[1] - b[1])[0][0];

  return { timer: timerText, lastResults: results, prediction };
}

// API route to get data
app.get('/api/results', async (req, res) => {
  try {
    const data = await scrapeWingo();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));