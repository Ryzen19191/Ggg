const fs = require("fs");
const path = require("path");

const usersFile = path.join(__dirname, "../users.json");

// Load user data from file
function loadUsers() {
    if (!fs.existsSync(usersFile)) {
        fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(usersFile)).users;
}

// Save user data to file
function saveUsers(users) {
    fs.writeFileSync(usersFile, JSON.stringify({ users }, null, 2));
}

// Add a user to the list if not already added
function addUser(userId) {
    let users = loadUsers();
    if (!users.includes(userId)) {
        users.push(userId);
        saveUsers(users);
    }
}

// Get all registered users
function getAllUsers() {
    return loadUsers();
}

// Export functions
module.exports = { addUser, getAllUsers };