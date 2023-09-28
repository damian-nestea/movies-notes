const createUsers = `CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  password VARCHAR NOT NULL,
  avatar VARCHAR,
  created_at TIMESTAMP DATE DEFAULT (DATETIME('now','localtime')),
  updated_at TIMESTAMP DATE DEFAULT (DATETIME('now','localtime'))
)`;

module.exports = createUsers;
