import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor completa todos los campos');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #5c2e0b 0%, #8b4513 45%, #d4af37 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-[-60px] right-[-60px] w-52 h-52 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-60px] w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

      {/* Logo Area */}
      <div className="flex flex-col items-center mb-8 z-10">
        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl mb-4">
          <Fingerprint className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Parroquia</h1>
        <p className="text-white/70 text-sm mt-1">Sistema de Asistencia</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl p-7 z-10">
        <h2 className="text-xl font-bold text-gray-800 mb-1">Bienvenido</h2>
        <p className="text-sm text-gray-500 mb-6">Inicia sesión para continuar</p>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-2xl flex items-start text-red-600 gap-3">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span className="text-sm leading-snug">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 ml-1">Correo electrónico</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-4.5 w-4.5 text-gray-400" size={18} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mobile-input pl-10"
                placeholder="admin@parroquia.com"
                disabled={loading}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-600 ml-1">Contraseña</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={18} />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mobile-input pl-10 pr-11"
                placeholder="••••••••"
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </div>
        </form>
      </div>

      <p className="text-white/40 text-xs mt-8 z-10 text-center">
        Asistencia Parroquial v1.0 Miguel Antoio Tamat Ajuchan - 2026
      </p>
    </div>
  );
};

export default Login;
