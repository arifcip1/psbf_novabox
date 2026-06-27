import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Lock } from 'lucide-react';
import Logo from '../components/Logo';

const Register = () => {
    const [nama, setNama] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Staff Gudang');
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await register(nama, email, password, role);
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-rose-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-200 to-rose-400">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <Logo className="h-16 w-16" />
                    </div>
                </div>
                <h2 className="mt-8 text-center text-4xl font-black text-slate-900 tracking-tight uppercase">
                    Buat Akun NovaBox
                </h2>
                <p className="mt-3 text-center text-base font-bold text-slate-800">
                    Atau{' '}
                    <Link to="/login" className="text-indigo-700 hover:text-indigo-900 underline decoration-4 underline-offset-4 transition-colors">
                        masuk ke akun Anda
                    </Link>
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-10 px-4 border-4 border-slate-900 sm:rounded-[2rem] sm:px-10 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)]">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">Nama Lengkap</label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-6 w-6 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">Alamat Email</label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-6 w-6 text-slate-500" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">Kata Sandi</label>
                            <div className="mt-2 relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-6 w-6 text-slate-500" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    className="focus:ring-0 focus:outline-none block w-full pl-12 sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-black text-slate-900 uppercase tracking-wider">Pilih Peran (Role)</label>
                            <div className="mt-2 relative">
                                <select
                                    required
                                    className="focus:ring-0 focus:outline-none block w-full sm:text-lg font-bold border-2 border-slate-900 rounded-xl py-3 px-4 bg-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-transform hover:-translate-y-0.5 appearance-none"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                >
                                    <option value="Admin">Admin (Akses Penuh)</option>
                                    <option value="Manajer">Manajer (Akses Analitik)</option>
                                    <option value="Staff Gudang">Staff Gudang (Akses Lapangan)</option>
                                </select>
                                {/* Custom arrow for select */}
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-900">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-lg font-black text-slate-900 bg-sky-300 hover:bg-sky-400 hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all uppercase tracking-widest"
                            >
                                Daftar Sekarang
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
