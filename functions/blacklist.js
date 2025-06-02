const fs = require("fs");
const path = require("path");

const blacklistFile = path.join(__dirname, "../blacklist.json");

// Load blacklist from file
function loadBlacklist() {
    if (!fs.existsSync(blacklistFile)) {
        fs.writeFileSync(blacklistFile, JSON.stringify({ blacklisted: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(blacklistFile)).blacklisted;
}

// Check if a number is blacklisted
function isBlacklisted(number) {
    return loadBlacklist().includes(number);
}

// Add number to blacklist
function addToBlacklist(number) {
    let blacklist = loadBlacklist();
    if (!blacklist.includes(number)) {
        blacklist.push(number);
        fs.writeFileSync(blacklistFile, JSON.stringify({ blacklisted: blacklist }, null, 2));
    }
}

// Remove number from blacklist
function removeFromBlacklist(number) {
    let blacklist = loadBlacklist();
    blacklist = blacklist.filter(n => n !== number);
    fs.writeFileSync(blacklistFile, JSON.stringify({ blacklisted: blacklist }, null, 2));
}

// ✅ Correctly define and export getBlacklist
function getBlacklist() {
    return loadBlacklist();
}

// Export functions
module.exports = { isBlacklisted, addToBlacklist, removeFromBlacklist, getBlacklist };