const express = require('express');
const cors = require('cors');
const multer = require('multer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const pool = require('./db'); // MySQL Connection Pool

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- DB INITIALIZATION ROUTE ---
app.get('/api/init-db', async (req, res) => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tb_users (
                id_user VARCHAR(36) PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL UNIQUE,
                password VARCHAR(255) NOT NULL,
                role ENUM('Super Admin', 'Admin', 'Manajer', 'Staff Gudang') DEFAULT 'Staff Gudang',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        await pool.query(`
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
        await pool.query(`
            CREATE TABLE IF NOT EXISTS tb_stock_logs (
                id_log INT AUTO_INCREMENT PRIMARY KEY,
                id_produk VARCHAR(36) NOT NULL,
                jenis_mutasi ENUM('Masuk', 'Keluar') NOT NULL,
                jumlah_mutasi INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (id_produk) REFERENCES tb_products(id_produk) ON DELETE CASCADE
            )
        `);
        
        const [rows] = await pool.query('SELECT * FROM tb_users WHERE email = ?', ['admin@smartinventory.com']);
        if (rows.length === 0) {
            const crypto = require('crypto');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await pool.query(
                'INSERT INTO tb_users (id_user, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
                [crypto.randomUUID(), 'Administrator', 'admin@smartinventory.com', hashedPassword, 'Super Admin']
            );
        }
        res.send('<h1>Database berhasil dibuat!</h1><p>Semua tabel sudah siap. Silakan tutup halaman ini dan coba Login kembali.</p>');
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

// Expose uploads statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_12345';

// --- Multer Setup ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Netlify functions are read-only except for /tmp
        cb(null, process.env.NETLIFY ? '/tmp' : 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file extension. Only .jpg, .jpeg, .png allowed.'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
    fileFilter: fileFilter
});

// --- JWT Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token.' });
        req.user = user;
        next();
    });
};

// Error handling middleware for Multer
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ error: 'File too large. Maximum size is 2MB.' });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message });
    }
    next();
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { nama_pengguna, email, password, role } = req.body;

        if (!email.match(/^\S+@\S+\.\S+$/)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const [existingUsers] = await pool.query('SELECT email FROM tb_users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const id_user = crypto.randomUUID();
        const userRole = role || 'Staff Gudang';

        await pool.query(
            'INSERT INTO tb_users (id_user, full_name, email, password, role) VALUES (?, ?, ?, ?, ?)',
            [id_user, nama_pengguna, email, hashedPassword, userRole]
        );

        res.status(201).json({ message: 'User registered successfully', user: { id_user, email, role: userRole } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query('SELECT * FROM tb_users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ error: 'Invalid email or password' });

        const user = users[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id_user: user.id_user, email: user.email, role: user.role, nama_pengguna: user.full_name }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'Login successful', token, user: { id_user: user.id_user, nama_pengguna: user.full_name, role: user.role } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- INVENTORY CRUD ROUTES ---

app.get('/api/products', authenticateToken, async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM tb_products ORDER BY created_at DESC');
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', authenticateToken, upload.single('foto_produk'), handleMulterError, async (req, res) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Akses ditolak. Hanya Admin yang dapat menambah produk.' });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const { sku_code, nama_produk, kategori, lokasi, stok_aktual, batas_minimum, harga_beli, harga_jual } = req.body;

        const [existing] = await connection.query('SELECT sku_code FROM tb_products WHERE sku_code = ?', [sku_code]);
        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'SKU code already exists' });
        }

        const foto_produk = req.file ? `/uploads/${req.file.filename}` : null;
        const id_produk = crypto.randomUUID();
        const stok = parseInt(stok_aktual) || 0;

        await connection.query(
            `INSERT INTO tb_products (id_produk, sku_code, nama_produk, kategori, lokasi, stok_aktual, batas_minimum, harga_beli, harga_jual, foto_produk) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id_produk, sku_code, nama_produk, kategori, lokasi || 'Gudang Utama', stok, parseInt(batas_minimum) || 0, parseFloat(harga_beli) || 0, parseFloat(harga_jual) || 0, foto_produk]
        );

        if (stok > 0) {
            await connection.query(
                `INSERT INTO tb_stock_logs (id_produk, jenis_mutasi, jumlah_mutasi) VALUES (?, 'Masuk', ?)`,
                [id_produk, stok]
            );
        }

        await connection.commit();
        res.status(201).json({ id_produk, sku_code, nama_produk, stok_aktual: stok });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.put('/api/products/:id', authenticateToken, upload.single('foto_produk'), handleMulterError, async (req, res) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Akses ditolak. Hanya Admin yang dapat mengedit produk.' });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;

        const [products] = await connection.query('SELECT * FROM tb_products WHERE id_produk = ?', [id]);
        if (products.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Product not found' });
        }

        const product = products[0];
        const { sku_code, nama_produk, kategori, lokasi, stok_aktual, batas_minimum, harga_beli, harga_jual } = req.body;

        let foto_produk = product.foto_produk;
        if (req.file) {
            foto_produk = `/uploads/${req.file.filename}`;
        }

        const oldStock = product.stok_aktual;
        const newStock = parseInt(stok_aktual);

        if (!isNaN(newStock) && newStock !== oldStock) {
            const diff = newStock - oldStock;
            await connection.query(
                `INSERT INTO tb_stock_logs (id_produk, jenis_mutasi, jumlah_mutasi) VALUES (?, ?, ?)`,
                [id, diff > 0 ? 'Masuk' : 'Keluar', Math.abs(diff)]
            );
        }

        await connection.query(
            `UPDATE tb_products SET 
                sku_code = COALESCE(?, sku_code),
                nama_produk = COALESCE(?, nama_produk),
                kategori = COALESCE(?, kategori),
                lokasi = COALESCE(?, lokasi),
                stok_aktual = COALESCE(?, stok_aktual),
                batas_minimum = COALESCE(?, batas_minimum),
                harga_beli = COALESCE(?, harga_beli),
                harga_jual = COALESCE(?, harga_jual),
                foto_produk = COALESCE(?, foto_produk)
            WHERE id_produk = ?`,
            [
                sku_code || null,
                nama_produk || null,
                kategori || null,
                lokasi || null,
                !isNaN(newStock) ? newStock : null,
                !isNaN(parseInt(batas_minimum)) ? parseInt(batas_minimum) : null,
                !isNaN(parseFloat(harga_beli)) ? parseFloat(harga_beli) : null,
                !isNaN(parseFloat(harga_jual)) ? parseFloat(harga_jual) : null,
                foto_produk,
                id
            ]
        );

        await connection.commit();
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.patch('/api/products/:id/stock', authenticateToken, async (req, res) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const { id } = req.params;
        const { difference } = req.body; // e.g., 1 or -1

        if (typeof difference !== 'number') {
            await connection.rollback();
            return res.status(400).json({ error: 'Difference must be a number' });
        }

        const [products] = await connection.query('SELECT stok_aktual FROM tb_products WHERE id_produk = ? FOR UPDATE', [id]);
        if (products.length === 0) {
            await connection.rollback();
            return res.status(404).json({ error: 'Product not found' });
        }

        const currentStock = products[0].stok_aktual;
        const newStock = currentStock + difference;

        if (newStock < 0) {
            await connection.rollback();
            return res.status(400).json({ error: 'Stock cannot be less than 0' });
        }

        await connection.query('UPDATE tb_products SET stok_aktual = ? WHERE id_produk = ?', [newStock, id]);

        if (difference !== 0) {
            await connection.query(
                `INSERT INTO tb_stock_logs (id_produk, jenis_mutasi, jumlah_mutasi) VALUES (?, ?, ?)`,
                [id, difference > 0 ? 'Masuk' : 'Keluar', Math.abs(difference)]
            );
        }

        await connection.commit();
        res.json({ message: 'Stock updated successfully', newStock });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

app.delete('/api/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Akses ditolak. Hanya Admin yang dapat menghapus produk.' });
    }
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM tb_products WHERE id_produk = ?', [id]);

        if (result.affectedRows === 0) return res.status(404).json({ error: 'Product not found' });

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk Import
app.post('/api/products/bulk', authenticateToken, async (req, res) => {
    if (req.user.role !== 'Admin' && req.user.role !== 'Super Admin') {
        return res.status(403).json({ error: 'Akses ditolak. Hanya Admin yang dapat melakukan impor CSV.' });
    }
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();
        const products = req.body; // Expecting an array of products
        let addedCount = 0;
        let updatedCount = 0;

        for (const p of products) {
            const [existing] = await connection.query('SELECT id_produk, stok_aktual FROM tb_products WHERE sku_code = ?', [p.sku_code]);
            const stock = parseInt(p.stok_aktual) || 0;

            if (existing.length > 0) {
                const product = existing[0];
                const oldStock = product.stok_aktual;

                if (stock !== oldStock) {
                    const diff = stock - oldStock;
                    await connection.query(
                        `INSERT INTO tb_stock_logs (id_produk, jenis_mutasi, jumlah_mutasi) VALUES (?, ?, ?)`,
                        [product.id_produk, diff > 0 ? 'Masuk' : 'Keluar', Math.abs(diff)]
                    );
                }

                await connection.query(
                    `UPDATE tb_products SET 
                        nama_produk = COALESCE(?, nama_produk),
                        kategori = COALESCE(?, kategori),
                        lokasi = COALESCE(?, lokasi),
                        stok_aktual = ?,
                        batas_minimum = COALESCE(?, batas_minimum),
                        harga_beli = COALESCE(?, harga_beli),
                        harga_jual = COALESCE(?, harga_jual)
                    WHERE id_produk = ?`,
                    [p.nama_produk || null, p.kategori || null, p.lokasi || null, stock, parseInt(p.batas_minimum) || null, parseFloat(p.harga_beli) || null, parseFloat(p.harga_jual) || null, product.id_produk]
                );
                updatedCount++;
            } else {
                const id_produk = crypto.randomUUID();
                await connection.query(
                    `INSERT INTO tb_products (id_produk, sku_code, nama_produk, kategori, lokasi, stok_aktual, batas_minimum, harga_beli, harga_jual) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [id_produk, p.sku_code, p.nama_produk, p.kategori, p.lokasi || 'Gudang Utama', stock, parseInt(p.batas_minimum) || 0, parseFloat(p.harga_beli) || 0, parseFloat(p.harga_jual) || 0]
                );
                addedCount++;

                if (stock > 0) {
                    await connection.query(
                        `INSERT INTO tb_stock_logs (id_produk, jenis_mutasi, jumlah_mutasi) VALUES (?, 'Masuk', ?)`,
                        [id_produk, stock]
                    );
                }
            }
        }

        await connection.commit();
        res.status(200).json({ message: `Bulk import success. Added: ${addedCount}, Updated: ${updatedCount}` });
    } catch (error) {
        await connection.rollback();
        res.status(500).json({ error: error.message });
    } finally {
        connection.release();
    }
});

// Audit Logs
app.get('/api/logs', authenticateToken, async (req, res) => {
    try {
        const [logsWithDetails] = await pool.query(`
            SELECT l.*, p.nama_produk, p.sku_code 
            FROM tb_stock_logs l 
            LEFT JOIN tb_products p ON l.id_produk = p.id_produk 
            ORDER BY l.created_at DESC
        `);
        res.json(logsWithDetails);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ANALYTICS ENGINE ---

app.get('/api/analytics', authenticateToken, async (req, res) => {
    try {
        const [products] = await pool.query('SELECT * FROM tb_products');

        // 1. Financial Asset Valuation
        const total_aset_gudang = products.reduce((acc, product) => {
            return acc + (Number(product.stok_aktual) * Number(product.harga_beli));
        }, 0);

        // 2 & 3. Automated Inventory Health Evaluation & Procurement Budget
        let critical_products_count = 0;
        let total_projected_procurement_budget = 0;

        const evaluated_products = products.map(product => {
            let status = 'Aman';
            let recommended_units = 0;
            let projected_cost = 0;

            const stok = Number(product.stok_aktual);
            const batas = Number(product.batas_minimum);
            const harga = Number(product.harga_beli);

            if (stok === 0) {
                status = 'Habis';
            } else if (stok <= batas) {
                status = 'Butuh Re-stock';
            }

            if (status === 'Habis' || status === 'Butuh Re-stock') {
                critical_products_count++;
                recommended_units = (batas * 2) - stok;
                projected_cost = recommended_units * harga;
                total_projected_procurement_budget += projected_cost;
            }

            return {
                ...product,
                stok_aktual: stok,
                harga_beli: harga,
                harga_jual: Number(product.harga_jual),
                batas_minimum: batas,
                status,
                recommended_units,
                projected_cost
            };
        });

        res.json({
            total_aset_gudang,
            critical_products_count,
            total_projected_procurement_budget,
            evaluated_products
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- PROFILE ROUTES ---

app.get('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const [users] = await pool.query('SELECT id_user, full_name, email, role, created_at FROM tb_users WHERE id_user = ?', [req.user.id_user]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });
        res.json(users[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/me', authenticateToken, async (req, res) => {
    try {
        const { full_name, email } = req.body;
        if (!email.match(/^\S+@\S+\.\S+$/)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Check if email already used by someone else
        const [existing] = await pool.query('SELECT id_user FROM tb_users WHERE email = ? AND id_user != ?', [email, req.user.id_user]);
        if (existing.length > 0) return res.status(400).json({ error: 'Email already exists' });

        await pool.query('UPDATE tb_users SET full_name = ?, email = ? WHERE id_user = ?', [full_name, email, req.user.id_user]);

        // Return updated token data
        const [updatedUser] = await pool.query('SELECT * FROM tb_users WHERE id_user = ?', [req.user.id_user]);
        const user = updatedUser[0];
        const token = jwt.sign({ id_user: user.id_user, email: user.email, role: user.role, nama_pengguna: user.full_name }, JWT_SECRET, { expiresIn: '24h' });

        res.json({ message: 'Profile updated successfully', token, user: { id_user: user.id_user, nama_pengguna: user.full_name, role: user.role, email: user.email } });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/users/me/password', authenticateToken, async (req, res) => {
    try {
        const { old_password, new_password } = req.body;

        const [users] = await pool.query('SELECT password FROM tb_users WHERE id_user = ?', [req.user.id_user]);
        if (users.length === 0) return res.status(404).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(old_password, users[0].password);
        if (!validPassword) return res.status(400).json({ error: 'Kata sandi lama salah' });

        const hashedPassword = await bcrypt.hash(new_password, 10);
        await pool.query('UPDATE tb_users SET password = ? WHERE id_user = ?', [hashedPassword, req.user.id_user]);

        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/users/me', authenticateToken, async (req, res) => {
    try {
        await pool.query('DELETE FROM tb_users WHERE id_user = ?', [req.user.id_user]);
        res.json({ message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.NETLIFY) {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
