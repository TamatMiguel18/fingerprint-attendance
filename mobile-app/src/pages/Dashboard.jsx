import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, CalendarDays, CheckCircle, Clock, ChevronRight, Fingerprint } from 'lucide-react';
import api from '../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalGroups: 0,
    totalUsers: 0,
    totalActivities: 0,
    recentAttendance: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gRes, uRes, aRes, attRes] = await Promise.all([
          api.get('/groups'),
          api.get('/users'),
          api.get('/activities'),
          api.get('/attendance'),
        ]);
        setStats({
          totalGroups: gRes.data.length,
          totalUsers: uRes.data.filter(u => u.role === 'student').length,
          totalActivities: aRes.data.length,
          recentAttendance: attRes.data.slice(0, 4),
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <div
        className="relative px-6 pt-12 pb-10 rounded-b-[2.5rem] overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5c2e0b 0%, #8b4513 100%)' }}
      >
        <div className="absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[-20px] w-28 h-28 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="relative z-10">
          <p className="text-white/70 text-sm mb-1">{greeting()},</p>
          <h1 className="text-2xl font-bold text-white tracking-tight">{user?.name || user?.email?.split('@')[0] || 'Administrador'}</h1>
          <p className="text-white/50 text-xs mt-1">Panel de control parroquial</p>
        </div>
      </div>

      {/* Stats Cards (floating over header) */}
      <div className="px-5 -mt-5 z-20 relative">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-50 p-5 grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-orange-50 text-[#8b4513] rounded-2xl flex items-center justify-center mb-2">
              <Users size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.totalGroups}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">Grupos</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-amber-50 text-[#d4af37] rounded-2xl flex items-center justify-center mb-2">
              <CalendarDays size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.totalUsers}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">Feligreses</span>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-2">
              <CheckCircle size={20} />
            </div>
            <span className="text-2xl font-bold text-gray-800">{loading ? '—' : stats.totalActivities}</span>
            <span className="text-[10px] text-gray-400 font-medium mt-0.5 leading-tight">Eventos</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mt-6">
        <h2 className="text-base font-bold text-gray-700 mb-3">Acciones Rápidas</h2>
        <div className="space-y-3">
          <button
            onClick={() => navigate('/kiosk')}
            className="w-full bg-[#8b4513] text-white p-4 rounded-2xl flex items-center justify-between shadow-lg shadow-[#8b4513]/20 active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center">
                <Fingerprint size={22} />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Tomar Asistencia</p>
                <p className="text-xs text-white/60">Escanear huella dactilar</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-white/50" />
          </button>

          <button
            onClick={() => navigate('/groups')}
            className="w-full bg-white text-gray-800 p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm active:scale-[0.98] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center">
                <Users size={22} className="text-[#8b4513]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-sm">Gestionar Grupos</p>
                <p className="text-xs text-gray-400">Ver y añadir miembros</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300" />
          </button>
        </div>
      </div>

      {/* Recent Attendance */}
      <div className="px-5 mt-6 mb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-gray-700">Asistencia Reciente</h2>
          <button onClick={() => navigate('/logs')} className="text-xs text-[#8b4513] font-semibold">Ver todo</button>
        </div>

        <div className="mobile-card divide-y divide-gray-50">
          {loading ? (
            <div className="p-6 text-center text-gray-400 text-sm">Cargando...</div>
          ) : stats.recentAttendance.length === 0 ? (
            <div className="p-6 text-center text-gray-400 text-sm">No hay registros aún.</div>
          ) : (
            stats.recentAttendance.map((record) => (
              <div key={record.id} className="flex items-center gap-3 p-4">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${record.verified_by_fingerprint ? 'bg-green-50' : 'bg-blue-50'}`}>
                  {record.verified_by_fingerprint
                    ? <CheckCircle size={18} className="text-green-500" />
                    : <Clock size={18} className="text-blue-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{record.user_name}</p>
                  <p className="text-xs text-gray-400 truncate">{record.activity_name}</p>
                </div>
                <p className="text-xs text-gray-400 shrink-0">{record.time}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
