const mysql = require('mysql2/promise');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function initializeDatabase() {
    let connection;
    try {
        // Connect without database first to create it if it doesn't exist
        connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });

        console.log('Connected to MySQL. Creating database if not exists...');
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database \`${process.env.DB_NAME}\` is ready.`);

        // Switch to the database
        await connection.query(`USE \`${process.env.DB_NAME}\``);

        // Create tb_users
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tb_users (
                id_user VARCHAR(36) PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Super Admin', 'Admin', 'Manajer', 'Staff Gudang') DEFAULT 'Staff Gudang',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Table tb_users created.');

        // Create tb_products
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tb_products (
                id_produk VARCHAR(36) PRIMARY KEY,
                sku_code VARCHAR(50) NOT NULL UNIQUE,
                nama_produk VARCHAR(150) NOT NULL,
                kategori VARCHAR(50),
                lokasi VARCHAR(100) DEFAULT 'Gudang Utama',
                stok_aktual INT DEFAULT 0,
                batas_minimum INT DEFAULT 0,
                harga_beli DECIMAL(15,2) DEFAULT 0,
                harga_jual DECIMAL(15,2) DEFAULT 0,
                foto_produk VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Table tb_products created.');

        // Create tb_stock_logs
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tb_stock_logs (
                id_log INT AUTO_INCREMENT PRIMARY KEY,
                id_produk VARCHAR(36) NOT NULL,
                jenis_mutasi ENUM('Masuk', 'Keluar') NOT NULL,
                jumlah_mutasi INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_produk) REFERENCES tb_products(id_produk) ON DELETE CASCADE
            )
        `);
        console.log('Table tb_stock_logs created.');

        // Check if admin user exists, if not create default
        const [rows] = await connection.query('SELECT * FROM tb_users WHERE email = ?', ['admin@smartinventory.com']);
        if (rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await connection.query(
                'INSERT INTO tb_users (id_user, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [crypto.randomUUID(), 'Administrator', 'admin@smartinventory.com', hashedPassword, 'Super Admin']
            );
            console.log('Default Admin user created (admin@smartinventory.com / admin123).');
        }

        console.log('Database initialization completed successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

initializeDatabase();
