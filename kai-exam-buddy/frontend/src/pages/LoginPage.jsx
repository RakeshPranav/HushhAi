import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, LogIn, AlertCircle } from 'lucide-react';
import { loginUser } from '../services/authService';

function LoginPage({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic Validation
        if (!email.trim() || !password.trim()) {
            setError('Please fill in all fields.');
            return;
        }

        setError('');
        setLoading(true);

        try {
            const { user } = await loginUser(email, password);
            onLoginSuccess(user);
            navigate('/'); // Redirect to dashboard / landing
        } catch (err) {
            setError(err.message || 'Failed to sign in.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
            <div className="glass-card w-full max-w-md p-8 md:p-10 rounded-[2rem] border-t-2 border-t-primary-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-[50px] rounded-full -mr-10 -mt-10 pointer-events-none"></div>

                <div className="text-center mb-8 relative z-10">
                    <div className="w-16 h-16 bg-primary-500/20 border border-primary-500/30 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary-500/20">
                        <LogIn className="w-8 h-8 ml-1" />
                    </div>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h1>
                    <p className="text-slate-600">Sign in to continue your learning journey.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-in slide-up">
                        <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                        <p>{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50/50 rounded-xl border border-slate-900/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-900 placeholder-slate-500 outline-none transition-all"
                            placeholder="luminaIq@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-5 py-3.5 bg-slate-50/50 rounded-xl border border-slate-900/10 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-slate-900 placeholder-slate-500 outline-none transition-all"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 mt-2 bg-primary-600 text-slate-900 font-bold rounded-xl hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20 active:scale-[0.98] flex justify-center items-center gap-2"
                    >
                        {loading ? <img src="/logo.png" alt="Loading" className="w-6 h-6 animate-spin object-contain" /> : 'Log In'}
                    </button>
                </form>

                <p className="mt-8 text-center text-slate-600 text-sm relative z-10">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-primary-600 font-bold hover:text-primary-600 hover:underline transition-all">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
