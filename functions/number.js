const puppeteer = require('puppeteer');

// Function to get temporary number
async function tempNumber() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.receive-sms-online.info/');
    await page.waitForSelector('.number');
    const numbers = await page.$$eval('.number', numbers => numbers.map(n => n.innerText));
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];
    await browser.close();
    return randomNumber;
}

// Function to get OTP for the temp number
async function numberInbox() {
    const tempNumber = await tempNumber(); // Temporarily using the same number
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://www.receive-sms-online.info/');
    await page.click(`.number:contains('${tempNumber}')`);
    await page.waitForSelector('.message');
    const messages = await page.$$eval('.message', messages => messages.map(msg => msg.innerText));
    const otp = messages.find(msg => /\d{6,}/.test(msg));
    await browser.close();
    return otp || 'No OTP found';
}

// Export functions
module.exports = { tempNumber, numberInbox };