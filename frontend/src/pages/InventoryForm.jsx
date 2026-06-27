import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { Package, Save, ArrowLeft, UploadCloud } from 'lucide-react';

const InventoryForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        sku_code: '',
        nama_produk: '',
        kategori: '',
        lokasi: '',
        stok_aktual: 0,
        batas_minimum: 0,
        harga_beli: 0,
        harga_jual: 0
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEdit) {
            const fetchProduct = async () => {
                try {
                    const response = await api.get('/products');
                    const product = response.data.find(p => p.id_produk === id);
                    if (product) {
                        setFormData({
                            sku_code: product.sku_code,
                            nama_produk: product.nama_produk,
                            kategori: product.kategori,
                            lokasi: product.lokasi,
                            stok_aktual: product.stok_aktual,
                            batas_minimum: product.batas_minimum,
                            harga_beli: product.harga_beli,
                            harga_jual: product.harga_jual
                        });
                        if (product.foto_produk) {
                            setPreview(`http://localhost:5000${product.foto_produk}`);
                        }
                    }
                } catch (err) {
                    console.error(err);
                }
            };
            fetchProduct();
        }
    }, [id, isEdit]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const submitData = new FormData();
        Object.keys(formData).forEach(key => {
            submitData.append(key, formData[key]);
        });
        
        if (file) {
            submitData.append('foto_produk', file);
        }

        try {
            if (isEdit) {
                await api.put(`/products/${id}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/products', submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'An error occurred while saving the product.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate('/')}
                        className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Edit Produk' : 'Tambah Produk Baru'}
                    </h1>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Kode SKU</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="sku_code"
                                    required
                                    value={formData.sku_code}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                    placeholder="PROD-001"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Nama Produk</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="nama_produk"
                                    required
                                    value={formData.nama_produk}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Kategori</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="kategori"
                                    required
                                    value={formData.kategori}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Lokasi Penyimpanan</label>
                            <div className="mt-1">
                                <input
                                    type="text"
                                    name="lokasi"
                                    required
                                    value={formData.lokasi}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                    placeholder="Contoh: Rak B1 - Gudang Utama"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Stok Aktual</label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="stok_aktual"
                                    required
                                    min="0"
                                    value={formData.stok_aktual}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Batas Stok Minimum</label>
                            <div className="mt-1">
                                <input
                                    type="number"
                                    name="batas_minimum"
                                    required
                                    min="0"
                                    value={formData.batas_minimum}
                                    onChange={handleInputChange}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Harga Beli</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">Rp</span>
                                </div>
                                <input
                                    type="number"
                                    name="harga_beli"
                                    required
                                    min="0"
                                    value={formData.harga_beli}
                                    onChange={handleInputChange}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-3">
                            <label className="block text-sm font-medium text-gray-700">Harga Jual</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">Rp</span>
                                </div>
                                <input
                                    type="number"
                                    name="harga_jual"
                                    required
                                    min="0"
                                    value={formData.harga_jual}
                                    onChange={handleInputChange}
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-9 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-6">
                            <label className="block text-sm font-medium text-gray-700">Foto Produk</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    {preview ? (
                                        <div className="flex flex-col items-center">
                                            <img src={preview} alt="Preview" className="h-32 w-auto object-cover rounded-md mb-4" />
                                            <button
                                                type="button"
                                                onClick={() => { setFile(null); setPreview(null); }}
                                                className="text-sm text-red-600 hover:text-red-500"
                                            >
                                                Hapus gambar
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                            <div className="flex text-sm text-gray-600 mt-4">
                                                <label
                                                    htmlFor="file-upload"
                                                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                                >
                                                    <span>Unggah file</span>
                                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".jpg,.jpeg,.png" />
                                                </label>
                                                <p className="pl-1">atau seret dan lepas</p>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, JPEG maksimal 2MB</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-5 border-t border-gray-200 flex justify-end">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? 'Menyimpan...' : 'Simpan Produk'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryForm;
