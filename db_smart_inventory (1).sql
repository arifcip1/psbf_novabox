-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 25, 2026 at 08:52 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_smart_inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `tb_products`
--

CREATE TABLE `tb_products` (
  `id_produk` varchar(36) NOT NULL,
  `sku_code` varchar(50) NOT NULL,
  `nama_produk` varchar(150) NOT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `lokasi` varchar(100) DEFAULT 'Gudang Utama',
  `stok_aktual` int(11) DEFAULT 0,
  `batas_minimum` int(11) DEFAULT 0,
  `harga_beli` decimal(15,2) DEFAULT 0.00,
  `harga_jual` decimal(15,2) DEFAULT 0.00,
  `foto_produk` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_products`
--

INSERT INTO `tb_products` (`id_produk`, `sku_code`, `nama_produk`, `kategori`, `lokasi`, `stok_aktual`, `batas_minimum`, `harga_beli`, `harga_jual`, `foto_produk`, `created_at`, `updated_at`) VALUES
('60caa400-0c6a-465d-aa34-8d760551584c', 'PROD-03', 'Mechanical Keyboard Keychron', 'Accessories', 'Gudang Utama - Rak B2', 49, 5, 1500000.00, 2000000.00, '\\uploads\\kibort.webp', '2026-06-16 18:14:15', '2026-06-17 10:23:54'),
('796838a4-3712-4b52-b9dd-0faca4f11b35', 'PROD-06', 'Lenovo IdeaPad i3', 'Elektronik', 'Gudang Utama - Rak A2', 15, 10, 6000000.00, 6500000.00, '\\uploads\\ideapad3i.jpeg', '2026-06-17 10:11:17', '2026-06-17 10:34:14'),
('8700fd39-c855-4393-a69d-9f0acf915e6e', 'PROD-05', 'Meja Kerja Ergonomis', 'Furniture', 'Cabang A - Display', 0, 3, 1200000.00, 1800000.00, '\\uploads\\meja-kantor-ergonomis-3.webp', '2026-06-16 18:14:15', '2026-06-17 10:34:51'),
('89570660-fb68-4625-8f45-0ac1322616dc', 'PROD-02', 'Wireless Mouse Logitech', 'Accessories', 'Toko Cabang - Etalase Depan', 1000, 5, 150000.00, 250000.00, '\\uploads\\logitech.jpeg', '2026-06-16 18:14:15', '2026-06-24 18:44:11'),
('afc4007b-afe1-45fe-8039-de3cc5e8d950', 'PROD-01', 'Laptop Lenovo ThinkPad', 'Electronics', 'Gudang Utama - Rak A1', 5, 10, 10000000.00, 12000000.00, '\\uploads\\thinkpadxseries.avif', '2026-06-16 18:14:15', '2026-06-17 10:28:41'),
('c97aecdf-523a-4514-b5cd-14ed1775aa1e', 'PROD-04', 'Monitor Dell 27 inch', 'Electronics', 'Gudang Utama - Rak C1', 15, 5, 3000000.00, 3500000.00, '\\uploads\\dell27.jpeg', '2026-06-16 18:14:15', '2026-06-17 10:29:19');

-- --------------------------------------------------------

--
-- Table structure for table `tb_stock_logs`
--

CREATE TABLE `tb_stock_logs` (
  `id_log` int(11) NOT NULL,
  `id_produk` varchar(36) NOT NULL,
  `jenis_mutasi` enum('Masuk','Keluar') NOT NULL,
  `jumlah_mutasi` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_stock_logs`
--

INSERT INTO `tb_stock_logs` (`id_log`, `id_produk`, `jenis_mutasi`, `jumlah_mutasi`, `created_at`) VALUES
(1, 'afc4007b-afe1-45fe-8039-de3cc5e8d950', 'Masuk', 5, '2026-06-16 18:14:15'),
(2, '60caa400-0c6a-465d-aa34-8d760551584c', 'Masuk', 50, '2026-06-16 18:14:15'),
(3, 'c97aecdf-523a-4514-b5cd-14ed1775aa1e', 'Masuk', 15, '2026-06-16 18:14:15'),
(4, '8700fd39-c855-4393-a69d-9f0acf915e6e', 'Masuk', 2, '2026-06-16 18:14:15'),
(5, '8700fd39-c855-4393-a69d-9f0acf915e6e', 'Masuk', 1, '2026-06-16 18:41:45'),
(6, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:41:59'),
(7, '60caa400-0c6a-465d-aa34-8d760551584c', 'Keluar', 1, '2026-06-16 18:42:16'),
(8, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:44:02'),
(9, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:44:02'),
(10, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:44:06'),
(11, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:44:06'),
(12, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:44:06'),
(13, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:44:06'),
(14, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 1, '2026-06-16 18:44:07'),
(15, '89570660-fb68-4625-8f45-0ac1322616dc', 'Keluar', 1, '2026-06-16 18:44:10'),
(16, '89570660-fb68-4625-8f45-0ac1322616dc', 'Keluar', 1, '2026-06-16 18:44:10'),
(17, '8700fd39-c855-4393-a69d-9f0acf915e6e', 'Masuk', 3, '2026-06-16 18:47:42'),
(18, '89570660-fb68-4625-8f45-0ac1322616dc', 'Keluar', 6, '2026-06-16 18:47:59'),
(19, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 50, '2026-06-17 08:52:26'),
(20, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Masuk', 10, '2026-06-17 10:11:17'),
(21, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:31'),
(22, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:32'),
(23, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:36'),
(24, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:36'),
(25, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:36'),
(26, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:36'),
(27, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:37'),
(28, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:37'),
(29, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:37'),
(30, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Keluar', 1, '2026-06-17 10:11:37'),
(31, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Masuk', 1, '2026-06-17 10:11:39'),
(32, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Masuk', 1, '2026-06-17 10:11:39'),
(33, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Masuk', 1, '2026-06-17 10:11:40'),
(34, '796838a4-3712-4b52-b9dd-0faca4f11b35', 'Masuk', 12, '2026-06-17 10:11:47'),
(35, '8700fd39-c855-4393-a69d-9f0acf915e6e', 'Keluar', 6, '2026-06-17 10:34:51'),
(36, '89570660-fb68-4625-8f45-0ac1322616dc', 'Keluar', 50, '2026-06-17 10:35:11'),
(37, '89570660-fb68-4625-8f45-0ac1322616dc', 'Masuk', 10000, '2026-06-24 18:44:03'),
(38, '89570660-fb68-4625-8f45-0ac1322616dc', 'Keluar', 9000, '2026-06-24 18:44:11');

-- --------------------------------------------------------

--
-- Table structure for table `tb_users`
--

CREATE TABLE `tb_users` (
  `id_user` varchar(36) NOT NULL,
  `full_name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('Super Admin','Admin','Manajer','Staff Gudang') DEFAULT 'Staff Gudang',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tb_users`
--

INSERT INTO `tb_users` (`id_user`, `full_name`, `email`, `password`, `role`, `created_at`) VALUES
('03776100-d38b-44a7-b29d-a40b1570ca86', 'Hani', 'admin@smartinventory.com', '12345', 'Super Admin', '2026-06-16 18:05:42'),
('6b44c268-a1af-4943-a183-f4a9d3631c18', 'Ryan', 'staff@novabox.com', '12345', 'Staff Gudang', '2026-06-24 18:05:56'),
('8c49feee-1971-4b45-b431-5fdbae0890ad', 'Arif', 'manajer@novabox.com', '12345', 'Manajer', '2026-06-24 18:05:25'),
('bac748cd-9053-4df2-a106-f31106468214', 'Mutia', 'admin@novabox.com', '12345', 'Admin', '2026-06-24 18:09:08');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tb_products`
--
ALTER TABLE `tb_products`
  ADD PRIMARY KEY (`id_produk`),
  ADD UNIQUE KEY `sku_code` (`sku_code`);

--
-- Indexes for table `tb_stock_logs`
--
ALTER TABLE `tb_stock_logs`
  ADD PRIMARY KEY (`id_log`),
  ADD KEY `id_produk` (`id_produk`);

--
-- Indexes for table `tb_users`
--
ALTER TABLE `tb_users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tb_stock_logs`
--
ALTER TABLE `tb_stock_logs`
  MODIFY `id_log` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tb_stock_logs`
--
ALTER TABLE `tb_stock_logs`
  ADD CONSTRAINT `tb_stock_logs_ibfk_1` FOREIGN KEY (`id_produk`) REFERENCES `tb_products` (`id_produk`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
