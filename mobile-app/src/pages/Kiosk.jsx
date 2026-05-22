import React, { useState, useEffect } from 'react';
import { activityService, userService, webAuthnService } from '../services/api';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';
import {
  Fingerprint, UserCheck, UserPlus, AlertCircle, CheckCircle,
  ChevronDown, Users
} from 'lucide-react';

const Kiosk = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [status, setStatus] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [aRes, uRes] = await Promise.all([
          activityService.getAllActivities(),
          userService.getAllUsers(),
        ]);
        setActivities(aRes.data || []);
        setUsers((uRes.data || []).filter(u => u.role === 'student'));
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setInitLoading(false);
      }
    };
    fetchInitial();
  }, []);

  const showStatus = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus({ type: '', text: '' }), 5000);
  };

  const filteredUsers = selectedActivity
    ? users.filter(u => {
        const act = activities.find(a => a.id == selectedActivity);
        return act?.group_id === u.group_id || act?.group_id == u.group_id;
      })
    : [];

  const handleTakeAttendance = async () => {
    if (!selectedUser || !selectedActivity) {
      return showStatus('error', 'Selecciona un evento y un feligrés primero.');
    }
    setLoading(true);
    try {
      const optRes = await webAuthnService.getAuthOptions(selectedUser);
      const asseResp = await startAuthentication(optRes.data);
      const verRes = await webAuthnService.verifyAuth(selectedUser, selectedActivity, asseResp);
      if (verRes.data?.verified) {
        showStatus('success', '✅ ¡Asistencia registrada con éxito!');
        setSelectedUser('');
      } else {
        showStatus('error', 'Autenticación fallida. Inténtalo de nuevo.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Error al escanear. Verifica que la huella esté registrada.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterFingerprint = async () => {
    if (!selectedUser) {
      return showStatus('error', 'Selecciona un feligrés primero.');
    }
    setLoading(true);
    try {
      const optRes = await webAuthnService.getRegistrationOptions(selectedUser);
      const attResp = await startRegistration(optRes.data);
      const verRes = await webAuthnService.verifyRegistration(selectedUser, attResp);
      if (verRes.data?.verified) {
        showStatus('success', '✅ ¡Huella registrada exitosamente!');
      } else {
        showStatus('error', 'No se pudo registrar la huella. Intenta de nuevo.');
      }
    } catch (err) {
      console.error(err);
      showStatus('error', 'Error al registrar. Asegúrate de que el dispositivo sea compatible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-8 rounded-b-[2.5rem] relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #5c2e0b 0%, #8b4513 100%)' }}
      >
        <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="relative z-10 text-center">
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/30">
            <Fingerprint className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">Kiosko de Asistencia</h1>
          <p className="text-white/60 text-sm mt-1">Registra asistencia con huella dactilar</p>
        </div>
      </div>

      {/* Status Banner */}
      {status.text && (
        <div className={`mx-5 mt-4 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
          status.type === 'success'
            ? 'bg-green-50 text-green-700 border border-green-200'
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {status.type === 'success'
            ? <CheckCircle size={20} className="shrink-0" />
            : <AlertCircle size={20} className="shrink-0" />}
          {status.text}
        </div>
      )}

      {/* Main Form */}
      <div className="px-5 mt-5 space-y-4">
        {/* Step 1: Activity */}
        <div className="mobile-card p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 bg-[#8b4513] rounded-full flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">1</span>
            </div>
            <p className="text-sm font-semibold text-gray-700">Seleccionar Evento</p>
          </div>
          {initLoading ? (
            <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
          ) : (
            <div className="relative">
              <select
                value={selectedActivity}
                onChange={e => { setSelectedActivity(e.target.value); setSelectedUser(''); }}
                className="mobile-input pr-10 appearance-none"
              >
                <option value="">— Elige un evento —</option>
                {activities.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({new Date(a.date).toLocaleDateString('es', { day: '2-digit', month: 'short' })})
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Step 2: User (shown only when activity selected) */}
        {selectedActivity && (
          <div className="mobile-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#8b4513] rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <p className="text-sm font-semibold text-gray-700">Seleccionar Feligrés</p>
            </div>
            {filteredUsers.length === 0 ? (
              <div className="p-4 bg-amber-50 rounded-xl flex items-center gap-2 text-amber-700 text-sm">
                <Users size={16} />
                <span>No hay feligreses en el grupo de este evento.</span>
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedUser}
                  onChange={e => setSelectedUser(e.target.value)}
                  className="mobile-input pr-10 appearance-none"
                >
                  <option value="">— Elige un feligrés —</option>
                  {filteredUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                  <ChevronDown size={18} className="text-gray-400" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        {selectedUser && selectedActivity && (
          <div className="space-y-3 pt-2">
            {/* Scan */}
            <button
              onClick={handleTakeAttendance}
              disabled={loading}
              className="w-full py-5 rounded-2xl flex flex-col items-center justify-center gap-2 text-white font-bold text-base shadow-xl shadow-[#8b4513]/30 active:scale-[0.97] transition-transform disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8b4513 0%, #5c2e0b 100%)' }}
            >
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-1">
                <Fingerprint size={30} className="text-white" />
              </div>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Escaneando...
                </div>
              ) : (
                <>
                  <span>Escanear Huella</span>
                  <span className="text-white/60 text-xs font-normal">Registrar asistencia ahora</span>
                </>
              )}
            </button>

            {/* Register */}
            <button
              onClick={handleRegisterFingerprint}
              disabled={loading}
              className="btn-secondary flex items-center justify-center gap-3 py-4 disabled:opacity-50"
            >
              <UserPlus size={20} />
              Registrar Huella Nueva
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kiosk;
