const db = require("../db");

function findUserByEmail(email, callback) {
  db.get("SELECT * FROM users WHERE email = ?", [email], callback);
}

function createUser(email, hashedPassword, callback) {
  db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword], callback);
}

module.exports = { findUserByEmail, createUser };
