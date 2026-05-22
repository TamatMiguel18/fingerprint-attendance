import { useState, useEffect } from 'react';
import api from '../services/api';
import { Fingerprint, UserCheck, UserPlus, AlertCircle } from 'lucide-react';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

const Kiosk = () => {
    const [activities, setActivities] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitial = async () => {
            const [aRes, uRes] = await Promise.all([api.get('/activities'), api.get('/users')]);
            setActivities(aRes.data);
            setUsers(uRes.data.filter(u => u.role === 'student'));
        };
        fetchInitial();
    }, []);

    const showMessage = (type, text) => {
        setStatusMessage({ type, text });
        setTimeout(() => setStatusMessage({ type: '', text: '' }), 5000);
    };

    const handleRegisterFingerprint = async () => {
        if (!selectedUser) return showMessage('error', 'Selecciona a un feligrés primero');
        setLoading(true);
        try {
            const resp = await api.get(`/webauthn/generate-registration-options/${selectedUser}`);
            const attResp = await startRegistration(resp.data);
            const verificationResp = await api.post(`/webauthn/verify-registration/${selectedUser}`, attResp);

            if (verificationResp.data && verificationResp.data.verified) {
                showMessage('success', '¡Huella registrada exitosamente!');
            } else {
                showMessage('error', 'No se pudo registrar la huella.');
            }
        } catch (error) {
            console.error(error);
            showMessage('error', 'Error al registrar huella. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleTakeAttendance = async () => {
        if (!selectedUser || !selectedActivity) {
            return showMessage('error', 'Selecciona el evento y el feligrés primero');
        }
        setLoading(true);
        try {
            const resp = await api.get(`/webauthn/generate-authentication-options/${selectedUser}`);
            const asseResp = await startAuthentication(resp.data);
            const verificationResp = await api.post(`/webauthn/verify-authentication/${selectedUser}/${selectedActivity}`, asseResp);

            if (verificationResp.data && verificationResp.data.verified) {
                showMessage('success', '¡Asistencia marcada correctamente!');
            } else {
                showMessage('error', 'Fallo de autenticación de huella.');
            }
        } catch (error) {
            console.error(error);
            showMessage('error', 'Error de lectura. Es posible que el dispositivo no sea compatible o la huella no esté registrada.');
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = selectedActivity 
        ? users.filter(u => activities.find(a => a.id == selectedActivity)?.group_id === u.group_id)
        : [];

    return (
        <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto pb-10">
            <header className="text-center mb-6 md:mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Kiosko de Asistencia</h1>
                <p className="text-textMuted text-base md:text-lg">Selecciona un evento y luego escanea la huella</p>
            </header>

            {statusMessage.text && (
                <div className={`p-4 rounded-xl text-center flex items-center justify-center gap-2 border text-sm md:text-base ${
                    statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-green-500/10 border-green-500/30 text-green-400'
                }`}>
                    {statusMessage.type === 'error' ? <AlertCircle className="w-5 h-5 flex-shrink-0" /> : <UserCheck className="w-5 h-5 flex-shrink-0" />}
                    <span>{statusMessage.text}</span>
                </div>
            )}

            <div className="glass-panel p-4 md:p-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-textMuted mb-2">1. Seleccionar Evento</label>
                        <select 
                            className="glass-input text-base md:text-lg py-3"
                            value={selectedActivity}
                            onChange={(e) => {
                                setSelectedActivity(e.target.value);
                                setSelectedUser('');
                            }}
                        >
                            <option value="">-- Eventos --</option>
                            {activities.map(a => <option key={a.id} value={a.id}>{a.name} ({new Date(a.date).toLocaleDateString()})</option>)}
                        </select>
                    </div>

                    {selectedActivity && (
                        <div>
                            <label className="block text-sm font-medium text-textMuted mb-2">2. Seleccionar Feligrés</label>
                            <select 
                                className="glass-input text-base md:text-lg py-3"
                                value={selectedUser}
                                onChange={(e) => setSelectedUser(e.target.value)}
                            >
                                <option value="">-- Miembros del Grupo --</option>
                                {filteredUsers.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                            </select>
                        </div>
                    )}
                </div>

                {selectedUser && selectedActivity && (
                    <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                        <button 
                            onClick={handleTakeAttendance}
                            disabled={loading}
                            className="flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 hover:from-primary/30 border border-primary/20 transition-all shadow-[0_0_30px_rgba(217,119,6,0.15)] group disabled:opacity-50"
                        >
                            <div className="p-4 bg-primary rounded-full mb-3 md:mb-4 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(217,119,6,0.5)]">
                                <Fingerprint className="w-8 h-8 md:w-10 md:h-10 text-white" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">Escanear Huella</h3>
                            <p className="text-xs md:text-sm text-textMuted text-center">Registrar asistencia ahora</p>
                        </button>

                        <button 
                            onClick={handleRegisterFingerprint}
                            disabled={loading}
                            className="flex flex-col items-center justify-center p-6 md:p-8 rounded-2xl bg-surface hover:bg-surfaceHover border border-border transition-all disabled:opacity-50"
                        >
                            <div className="p-4 bg-surface rounded-full mb-3 md:mb-4">
                                <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-white mb-1">Registrar Huella Nueva</h3>
                            <p className="text-xs md:text-sm text-textMuted text-center">Configurar dispositivo para el feligrés</p>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Kiosk;
