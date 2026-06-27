import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import Logo from './Logo';

const Navbar = () => {
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        setShowLogoutModal(true);
    };

    const confirmLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <>
        <nav className="bg-indigo-600 border-b-4 border-indigo-900 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="bg-white p-1.5 rounded-xl border-2 border-indigo-900 shadow-[2px_2px_0px_0px_rgba(49,46,129,1)] transition-transform group-hover:-translate-y-1 group-active:translate-y-0 group-active:shadow-none">
                                <Logo className="h-8 w-8" />
                            </div>
                            <span className="font-extrabold text-2xl text-white tracking-tight ml-2">NovaBox</span>
                        </Link>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-4 items-center">
                            <Link to="/" className="text-white/80 hover:text-white hover:bg-indigo-500/50 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                                Dasbor
                            </Link>
                            <Link to="/logs" className="text-white/80 hover:text-white hover:bg-indigo-500/50 px-4 py-2 rounded-xl text-sm font-bold transition-all">
                                Riwayat Mutasi
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-5">
                        <Link to="/profile" className="flex flex-col items-end group cursor-pointer" title="Lihat Profil">
                            <span className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">{user.nama_pengguna}</span>
                            <span className="text-xs font-bold text-indigo-900 bg-amber-400 px-2.5 py-0.5 rounded-full border-2 border-indigo-900 shadow-[1px_1px_0px_0px_rgba(49,46,129,1)] group-hover:-translate-y-0.5 transition-transform">{user.role}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 bg-indigo-500 text-white border-2 border-indigo-900 rounded-xl shadow-[2px_2px_0px_0px_rgba(49,46,129,1)] hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(49,46,129,1)] active:translate-y-0 active:shadow-none transition-all"
                            title="Keluar"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>

        {showLogoutModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                <div 
                    className="bg-white border-4 border-slate-900 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] transform transition-all animate-in fade-in zoom-in duration-200"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-rose-200 p-3 rounded-2xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
                            <AlertTriangle className="h-8 w-8 text-rose-600" strokeWidth={2.5} />
                        </div>
                        <button 
                            onClick={() => setShowLogoutModal(false)}
                            className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors border-2 border-transparent hover:border-slate-900"
                        >
                            <X className="h-6 w-6 text-slate-900" />
                        </button>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Keluar Sistem?</h3>
                    <p className="text-slate-600 font-bold mb-8">
                        Apakah Anda yakin ingin mengakhiri sesi dan keluar dari aplikasi NovaBox?
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="flex-1 px-4 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-xl font-bold text-base shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all"
                        >
                            Batal
                        </button>
                        <button
                            onClick={confirmLogout}
                            className="flex-1 px-4 py-3 bg-rose-400 border-2 border-slate-900 text-slate-900 rounded-xl font-black text-base shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5 hover:bg-rose-500 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all uppercase tracking-wider"
                        >
                            Ya, Keluar
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>
    );
};

export default Navbar;
