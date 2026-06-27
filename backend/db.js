const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

if (process.env.DB_URL) {
    pool = mysql.createPool({
        uri: process.env.DB_URL,
        ssl: { rejectUnauthorized: false }
    });
} else {
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
}

module.exports = pool;
