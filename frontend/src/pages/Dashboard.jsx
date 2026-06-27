import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import StatsCard from '../components/StatsCard';
import StatusBadge from '../components/StatusBadge';
import QRScannerModal from '../components/QRScannerModal';
import { QRCodeSVG } from 'qrcode.react';
import Papa from 'papaparse';
import { AuthContext } from '../context/AuthContext';
import { DollarSign, AlertTriangle, TrendingDown, Plus, Edit, Trash2, Package, ScanLine, Download, Upload, PlusCircle, MinusCircle, Search, Filter } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [editingStockId, setEditingStockId] = useState(null);
    const [editingStockValue, setEditingStockValue] = useState('');
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchAnalytics = async () => {
        try {
            const response = await api.get('/analytics');
            setAnalytics(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await api.delete(`/products/${id}`);
                fetchAnalytics();
            } catch (error) {
                console.error("Failed to delete product:", error);
            }
        }
    };

    const handleQuickStockChange = async (id, difference) => {
        try {
            await api.patch(`/products/${id}/stock`, { difference });
            fetchAnalytics(); // Refresh data in real-time
        } catch (error) {
            alert('Gagal mengubah stok: ' + (error.response?.data?.error || error.message));
        }
    };

    const handleStockSubmit = (product) => {
        if (editingStockId === null) return;

        const newStock = parseInt(editingStockValue);
        if (isNaN(newStock) || newStock < 0) {
            alert('Angka stok tidak valid (minimal 0).');
            setEditingStockId(null);
            return;
        }

        const difference = newStock - product.stok_aktual;
        if (difference !== 0) {
            handleQuickStockChange(product.id_produk, difference);
        }
        setEditingStockId(null);
    };

    const handleScan = (decodedText) => {
        setIsScannerOpen(false);
        const product = analytics?.evaluated_products.find(p => p.sku_code === decodedText);
        if (product) {
            navigate(`/product/edit/${product.id_produk}`);
        } else {
            alert('Produk dengan SKU tersebut tidak ditemukan.');
        }
    };

    const handleExportCSV = () => {
        if (!analytics) return;
        const csv = Papa.unparse(analytics.evaluated_products);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "data_inventaris.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setUploading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                try {
                    await api.post('/products/bulk', results.data);
                    alert('Data berhasil diimpor!');
                    fetchAnalytics();
                } catch (error) {
                    alert('Gagal mengimpor data: ' + (error.response?.data?.error || error.message));
                } finally {
                    setUploading(false);
                    e.target.value = null; // reset input
                }
            }
        });
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Memuat...</div>;
    if (!analytics) return <div className="min-h-screen flex items-center justify-center">Gagal memuat data.</div>;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(amount);
    };

    // --- CHART DATA PREPARATION ---

    // 1. Pie Chart Data (Status Proportion)
    const statusCounts = { Aman: 0, 'Butuh Re-stock': 0, Habis: 0 };
    analytics.evaluated_products.forEach(p => {
        if (statusCounts[p.status] !== undefined) {
            statusCounts[p.status]++;
        }
    });

    const pieData = [
        { name: 'Aman', value: statusCounts.Aman },
        { name: 'Butuh Re-stock', value: statusCounts['Butuh Re-stock'] },
        { name: 'Habis', value: statusCounts.Habis }
    ].filter(d => d.value > 0);

    const COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Amber, Red

    // 2. Bar Chart Data (Top 5 Products by Asset Value)
    const barData = [...analytics.evaluated_products]
        .map(p => ({
            name: p.nama_produk,
            NilaiAset: p.stok_aktual * p.harga_beli
        }))
        .sort((a, b) => b.NilaiAset - a.NilaiAset)
        .slice(0, 5);

    // 3. Search and Filter Logic
    const filteredProducts = analytics.evaluated_products.filter(product => {
        const matchSearch = product.nama_produk.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchFilter = statusFilter === 'Semua' || product.status === statusFilter;
        return matchSearch && matchFilter;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Analitik Dasbor</h1>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setIsScannerOpen(true)}
                        className="inline-flex items-center px-4 py-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-sm font-bold rounded-xl text-slate-900 bg-sky-300 hover:bg-sky-400 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                    >
                        <ScanLine className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                        Scan QR
                    </button>
                    {user?.role !== 'Staff Gudang' && (
                        <button
                            onClick={handleExportCSV}
                            className="inline-flex items-center px-4 py-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-sm font-bold rounded-xl text-slate-900 bg-amber-300 hover:bg-amber-400 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                        >
                            <Download className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                            Ekspor CSV
                        </button>
                    )}
                    {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
                        <>
                            <label className="inline-flex items-center px-4 py-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-sm font-bold rounded-xl text-slate-900 bg-rose-300 hover:bg-rose-400 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all cursor-pointer">
                                <Upload className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
                                {uploading ? 'Mengunggah...' : 'Impor CSV'}
                                <input type="file" accept=".csv" className="hidden" onChange={handleImportCSV} disabled={uploading} />
                            </label>
                            <button
                                onClick={() => navigate('/product/new')}
                                className="inline-flex items-center px-5 py-2 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all"
                            >
                                <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                                Produk Baru
                            </button>
                        </>
                    )}
                </div>
            </div>

            {user?.role !== 'Staff Gudang' && (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <StatsCard
                        title="Total Nilai Aset"
                        value={formatCurrency(analytics.total_aset_gudang)}
                        icon={DollarSign}
                        colorClass="bg-indigo-500"
                    />
                    <StatsCard
                        title="Jumlah Produk Kritis"
                        value={analytics.critical_products_count}
                        icon={AlertTriangle}
                        colorClass="bg-rose-500"
                    />
                    <StatsCard
                        title="Estimasi Anggaran Belanja"
                        value={formatCurrency(analytics.total_projected_procurement_budget)}
                        icon={TrendingDown}
                        colorClass="bg-amber-500"
                    />
                </div>
            )}

            {/* --- CHARTS SECTION --- */}
            {user?.role !== 'Staff Gudang' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Pie Chart */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 text-center uppercase tracking-wide">Proporsi Status Inventaris</h3>
                    <div className="h-64">
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="#0f172a"
                                        strokeWidth={2}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: '2px solid #0f172a', boxShadow: '4px 4px 0px 0px rgba(15,23,42,1)' }} />
                                    <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-bold">Tidak ada data status</div>
                        )}
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <h3 className="text-xl font-bold text-slate-900 mb-4 text-center uppercase tracking-wide">Top 5 Produk (Nilai Aset)</h3>
                    <div className="h-64">
                        {barData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={barData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#cbd5e1" />
                                    <XAxis type="number" tickFormatter={(val) => `Rp ${val / 1000000}M`} tick={{ fontWeight: 'bold' }} />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fontWeight: 'bold' }} />
                                    <RechartsTooltip formatter={(value) => formatCurrency(value)} contentStyle={{ borderRadius: '12px', border: '2px solid #0f172a', boxShadow: '4px 4px 0px 0px rgba(15,23,42,1)' }} />
                                    <Bar dataKey="NilaiAset" fill="#8b5cf6" radius={[0, 4, 4, 0]} stroke="#0f172a" strokeWidth={2} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-400 font-bold">Tidak ada data aset</div>
                        )}
                    </div>
                </div>
            </div>
            )}

            <div className="bg-white border-2 border-slate-900 rounded-3xl shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] overflow-hidden">
                <div className="px-6 py-5 border-b-2 border-slate-900 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-indigo-50">
                    <h3 className="text-2xl font-black text-slate-900 uppercase">Status Inventaris</h3>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-slate-500" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-10 sm:text-sm border-2 border-slate-900 rounded-xl py-2.5 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:ring-0 focus:outline-none transition-transform hover:-translate-y-0.5 font-bold"
                                placeholder="Cari nama atau SKU..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="relative flex items-center">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Filter className="h-5 w-5 text-slate-500" />
                            </div>
                            <select
                                className="block w-full pl-10 pr-8 sm:text-sm border-2 border-slate-900 rounded-xl py-2.5 bg-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] focus:ring-0 focus:outline-none transition-transform hover:-translate-y-0.5 cursor-pointer font-bold appearance-none"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="Semua">Semua Status</option>
                                <option value="Aman">Aman</option>
                                <option value="Butuh Re-stock">Butuh Re-stock</option>
                                <option value="Habis">Habis</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y-2 divide-slate-900">
                        <thead className="bg-slate-900">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-widest">Produk & Lokasi</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-widest">Identitas (SKU)</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-widest text-center">Stok Gudang</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-widest">Harga (Beli / Jual)</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-white uppercase tracking-widest">Status</th>
                                {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
                                    <th className="px-6 py-4 text-right text-xs font-black text-white uppercase tracking-widest">Aksi</th>
                                )}
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y-2 divide-slate-900">
                            {filteredProducts.map((product, idx) => (
                                <tr key={product.id_produk} className={`transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-indigo-50/50'} hover:bg-yellow-50`}>
                                    <td className="px-6 py-5">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-16 w-16 mt-1">
                                                {product.foto_produk ? (
                                                    <img className="h-16 w-16 rounded-xl object-cover border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]" src={`http://localhost:5000${product.foto_produk}`} alt="" />
                                                ) : (
                                                    <div className="h-16 w-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-500 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                                                        <Package size={28} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-5">
                                                <div className="text-lg font-black text-slate-900 leading-tight">{product.nama_produk}</div>
                                                <div className="text-sm font-bold text-slate-500 mt-1">{product.kategori}</div>
                                                <div className="inline-flex items-center mt-2 bg-indigo-100 text-indigo-800 text-xs font-bold px-2 py-0.5 rounded-md border-2 border-indigo-900">
                                                    📍 {product.lokasi}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-1 border-2 border-slate-900 rounded-lg shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] flex-shrink-0">
                                                <QRCodeSVG value={product.sku_code} size={36} />
                                            </div>
                                            <span className="text-sm font-black text-slate-700 bg-emerald-100 border-2 border-slate-900 px-2 py-1 rounded-md">{product.sku_code}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex items-center justify-center gap-3 bg-white p-2 border-2 border-slate-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] inline-flex">
                                            <button
                                                onClick={() => handleQuickStockChange(product.id_produk, -1)}
                                                disabled={product.stok_aktual <= 0}
                                                className="text-slate-900 bg-rose-200 hover:bg-rose-300 disabled:opacity-50 rounded-full p-1 border-2 border-slate-900 transition-colors"
                                                title="Kurangi Stok"
                                            >
                                                <MinusCircle size={20} />
                                            </button>

                                            <div className="flex flex-col items-center min-w-[3.5rem]">
                                                {editingStockId === product.id_produk ? (
                                                    <input
                                                        type="number"
                                                        className="w-16 text-center text-lg font-black text-slate-900 border-2 border-slate-900 rounded-lg focus:ring-0 focus:outline-none py-0.5"
                                                        value={editingStockValue}
                                                        onChange={(e) => setEditingStockValue(e.target.value)}
                                                        onBlur={() => handleStockSubmit(product)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') handleStockSubmit(product);
                                                            if (e.key === 'Escape') setEditingStockId(null);
                                                        }}
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <span
                                                        className="text-xl font-black text-slate-900 cursor-pointer border-b-2 border-slate-900 hover:text-indigo-600"
                                                        onDoubleClick={() => {
                                                            setEditingStockId(product.id_produk);
                                                            setEditingStockValue(product.stok_aktual);
                                                        }}
                                                        title="Klik 2x untuk edit manual"
                                                    >
                                                        {product.stok_aktual}
                                                    </span>
                                                )}
                                                <span className="text-[10px] font-bold text-slate-600 uppercase mt-0.5">Min: {product.batas_minimum}</span>
                                            </div>

                                            <button
                                                onClick={() => handleQuickStockChange(product.id_produk, 1)}
                                                className="text-slate-900 bg-emerald-200 hover:bg-emerald-300 rounded-full p-1 border-2 border-slate-900 transition-colors"
                                                title="Tambah Stok"
                                            >
                                                <PlusCircle size={20} />
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex flex-col gap-1">
                                            <div className="text-sm font-black text-slate-500">Beli: <span className="text-slate-900">{formatCurrency(product.harga_beli)}</span></div>
                                            <div className="text-sm font-black text-emerald-700 bg-emerald-100 inline-block px-2 py-0.5 rounded border-2 border-emerald-700 self-start">Jual: {formatCurrency(product.harga_jual)}</div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-5">
                                        <div className="flex flex-col items-start gap-2">
                                            <StatusBadge status={product.status} />
                                            {product.status !== 'Aman' && (
                                                <div className="text-xs font-bold text-slate-900 bg-amber-300 border-2 border-slate-900 px-2 py-1 rounded-md shadow-[1px_1px_0px_0px_rgba(15,23,42,1)] text-center">
                                                    Pesan: {product.recommended_units} unit
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    {(user?.role === 'Admin' || user?.role === 'Super Admin') && (
                                        <td className="px-4 py-5 text-right font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => navigate(`/product/edit/${product.id_produk}`)}
                                                    className="bg-indigo-300 text-slate-900 hover:bg-indigo-400 border-2 border-slate-900 rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-transform active:translate-y-0 active:shadow-none"
                                                    title="Edit Produk"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id_produk)}
                                                    className="bg-rose-300 text-slate-900 hover:bg-rose-400 border-2 border-slate-900 rounded-lg p-2 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 transition-transform active:translate-y-0 active:shadow-none"
                                                    title="Hapus Produk"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="p-8 text-center text-gray-500">
                            Tidak ada produk ditemukan yang cocok dengan filter pencarian.
                        </div>
                    )}
                </div>
            </div>
            <QRScannerModal
                isOpen={isScannerOpen}
                onClose={() => setIsScannerOpen(false)}
                onScan={handleScan}
            />
        </div>
    );
};

export default Dashboard;
