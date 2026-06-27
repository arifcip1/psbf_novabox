const mysql = require('mysql2/promise');
require('dotenv').config();

async function alterDatabase() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        });

        console.log('Connected to MySQL. Altering table...');
        
        // Alter the role column to ENUM
        await connection.query(`
            ALTER TABLE tb_users 
            MODIFY COLUMN role ENUM('Super Admin', 'Admin', 'Manajer', 'Staff Gudang') DEFAULT 'Staff Gudang'
        `);
        
        console.log('Table tb_users altered successfully. Role column is now ENUM.');
        
    } catch (error) {
        console.error('Error altering database:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

alterDatabase();
