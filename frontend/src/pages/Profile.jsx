import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock, ShieldAlert, Trash2, Save, ArrowLeft } from 'lucide-react';

const Profile = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [profileData, setProfileData] = useState({ full_name: '', email: '', role: '' });
    const [passwordData, setPasswordData] = useState({ old_password: '', new_password: '' });
    
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await api.get('/users/me');
            setProfileData({
                full_name: response.data.full_name,
                email: response.data.email,
                role: response.data.role
            });
            setLoading(false);
        } catch (err) {
            setError('Gagal memuat profil');
            setLoading(false);
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        setError('');
        setMessage('');
        try {
            const response = await api.put('/users/me', {
                full_name: profileData.full_name,
                email: profileData.email
            });
            // Update token in local storage if necessary, context will update on reload or we can just reload
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            setMessage('Profil berhasil diperbarui!');
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal memperbarui profil');
        } finally {
            setSaveLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setSaveLoading(true);
        setError('');
        setMessage('');
        try {
            await api.put('/users/me/password', passwordData);
            setMessage('Kata sandi berhasil diubah!');
            setPasswordData({ old_password: '', new_password: '' });
        } catch (err) {
            setError(err.response?.data?.error || 'Gagal mengubah kata sandi');
        } finally {
            setSaveLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm('PERINGATAN! Anda yakin ingin menghapus akun Anda secara permanen? Tindakan ini tidak dapat dibatalkan.');
        if (confirmDelete) {
            try {
                await api.delete('/users/me');
                logout();
                navigate('/login');
            } catch (err) {
                setError(err.response?.data?.error || 'Gagal menghapus akun');
            }
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-2xl text-slate-900">Memuat Profil...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 flex items-center gap-4">
                <button 
                    onClick={() => navigate('/')}
                    className="p-3 bg-white border-4 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all"
                >
                    <ArrowLeft className="h-6 w-6 text-slate-900" strokeWidth={3} />
                </button>
                <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Pengaturan Akun</h1>
            </div>

            {message && (
                <div className="mb-6 bg-emerald-200 border-4 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <p className="text-lg font-black text-emerald-900">{message}</p>
                </div>
            )}
            {error && (
                <div className="mb-6 bg-rose-200 border-4 border-slate-900 p-4 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                    <p className="text-lg font-black text-rose-900">{error}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Bagian Kiri: Info Profil & Ubah Data */}
                <div className="md:col-span-2 space-y-8">
                    {/* Kotak Informasi Profil */}
                    <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase border-b-4 border-slate-900 pb-4">Informasi Dasar</h2>
                        <form onSubmit={handleProfileUpdate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Nama Lengkap</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Alamat Email</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Peran Akun</label>
                                <input
                                    type="text"
                                    disabled
                                    className="block w-full sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 px-4 bg-indigo-100 text-indigo-900 cursor-not-allowed opacity-80"
                                    value={profileData.role}
                                />
                                <p className="text-xs font-bold text-slate-500 mt-2">*Peran tidak dapat diubah oleh pengguna.</p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saveLoading}
                                    className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-8 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-lg font-black text-slate-900 bg-sky-300 hover:bg-sky-400 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all uppercase tracking-wide"
                                >
                                    <Save className="h-5 w-5 mr-2" strokeWidth={3} />
                                    {saveLoading ? 'Menyimpan...' : 'Simpan Profil'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Kotak Ubah Password */}
                    <div className="bg-white border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                        <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase border-b-4 border-slate-900 pb-4">Keamanan (Ganti Sandi)</h2>
                        <form onSubmit={handlePasswordUpdate} className="space-y-5">
                            <div>
                                <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Kata Sandi Lama</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5"
                                        value={passwordData.old_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-black text-slate-900 uppercase tracking-wider mb-2">Kata Sandi Baru</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 bg-slate-50 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5"
                                        value={passwordData.new_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={saveLoading}
                                    className="w-full sm:w-auto inline-flex justify-center items-center py-3 px-8 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-lg font-black text-slate-900 bg-amber-300 hover:bg-amber-400 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all uppercase tracking-wide"
                                >
                                    Perbarui Sandi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Bagian Kanan: Danger Zone */}
                <div className="space-y-8">
                    <div className="bg-rose-100 border-4 border-slate-900 rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] flex flex-col items-center text-center">
                        <div className="bg-white p-4 rounded-full border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] mb-6">
                            <ShieldAlert className="h-12 w-12 text-rose-600" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Zona Bahaya</h2>
                        <p className="text-slate-700 font-bold mb-8">
                            Menghapus akun akan membatalkan semua hak akses Anda ke dalam sistem NovaBox. Tindakan ini bersifat permanen.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full inline-flex justify-center items-center py-4 px-4 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-lg font-black text-white bg-rose-600 hover:bg-rose-700 hover:-translate-y-0.5 active:translate-y-0 active:shadow-none transition-all uppercase tracking-widest"
                        >
                            <Trash2 className="h-5 w-5 mr-2" strokeWidth={3} />
                            Hapus Akun
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
