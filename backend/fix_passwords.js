const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function fixPasswords() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        const [users] = await connection.query('SELECT id_user, email, password FROM tb_users');
        
        for (const user of users) {
            // Check if password is not a bcrypt hash (bcrypt hashes usually start with $2a$ or $2b$ and are 60 chars long)
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
                console.log(`Fixing password for: ${user.email} (Current plain text: ${user.password})`);
                const hashedPassword = await bcrypt.hash(user.password, 10);
                await connection.query('UPDATE tb_users SET password = ? WHERE id_user = ?', [hashedPassword, user.id_user]);
            }
        }
        
        console.log('All plain text passwords have been successfully encrypted!');
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

fixPasswords();
