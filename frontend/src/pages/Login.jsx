import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen bg-amber-300 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-200 to-amber-400">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-3xl border-4 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                        <Logo className="h-16 w-16" />
                    </div>
                </div>
                <h2 className="mt-8 text-center text-4xl font-black text-slate-900 tracking-tight uppercase">
                    Masuk NovaBox
                </h2>
                <p className="mt-3 text-center text-base font-bold text-slate-800">
                    Atau{' '}
                    <Link to="/register" className="text-indigo-700 hover:text-indigo-900 underline decoration-4 underline-offset-4 transition-colors">
                        buat akun baru
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
                                    placeholder="admin@novabox.com"
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

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-4 px-4 border-2 border-slate-900 rounded-xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] text-lg font-black text-slate-900 bg-sky-300 hover:bg-sky-400 hover:-translate-y-1 active:translate-y-0 active:shadow-none transition-all uppercase tracking-widest"
                            >
                                Masuk Sekarang
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
