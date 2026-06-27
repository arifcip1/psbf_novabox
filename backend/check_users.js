const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkUsers() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [users] = await connection.query('SELECT id_user, email, password, role FROM tb_users');
        console.log('--- USERS IN DATABASE ---');
        users.forEach(u => {
            console.log(`Email: ${u.email} | Role: ${u.role} | Password Hash: ${u.password.substring(0, 15)}...`);
        });
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

checkUsers();
