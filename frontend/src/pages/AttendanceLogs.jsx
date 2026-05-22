import { useState, useEffect } from 'react';
import api from '../services/api';
import { Calendar, CheckCircle, XCircle, Clock } from 'lucide-react';

const AttendanceLogs = () => {
    const [records, setRecords] = useState([]);
    const [activities, setActivities] = useState([]);
    const [filterActivity, setFilterActivity] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [attRes, actRes] = await Promise.all([
                    api.get('/attendance'),
                    api.get('/activities')
                ]);
                setRecords(attRes.data);
                setActivities(actRes.data);
            } catch (error) {
                console.error("Error fetching data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const filteredRecords = filterActivity 
        ? records.filter(r => r.activity_id == filterActivity)
        : records;

    const getStatusIcon = (status, verified) => {
        if (verified) return <CheckCircle className="w-5 h-5 text-green-400" />;
        if (status === 'absent') return <XCircle className="w-5 h-5 text-red-400" />;
        if (status === 'late') return <Clock className="w-5 h-5 text-yellow-400" />;
        return <CheckCircle className="w-5 h-5 text-blue-400" />; // Manual present
    };

    const getStatusText = (status, verified) => {
        if (verified) return "Presente (Huella)";
        if (status === 'present') return "Presente (Manual)";
        return status === 'absent' ? 'Ausente' : 'Tarde';
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Historial de Asistencia</h1>
                    <p className="text-textMuted text-sm md:text-base">Consulta quiénes asistieron a los eventos parroquiales.</p>
                </div>
                <div className="w-full sm:w-auto">
                    <select 
                        className="glass-input bg-surface w-full sm:w-auto"
                        value={filterActivity}
                        onChange={(e) => setFilterActivity(e.target.value)}
                    >
                        <option value="">-- Todos los Eventos --</option>
                        {activities.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                </div>
            </header>

            <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-surfaceHover border-b border-border">
                                <th className="p-4 font-semibold text-textMuted">Feligrés</th>
                                <th className="p-4 font-semibold text-textMuted">Evento</th>
                                <th className="p-4 font-semibold text-textMuted">Fecha y Hora</th>
                                <th className="p-4 font-semibold text-textMuted">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-textMuted">Cargando registros...</td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-textMuted">No se encontró asistencia.</td>
                                </tr>
                            ) : (
                                filteredRecords.map(record => (
                                    <tr key={record.id} className="hover:bg-surfaceHover/50 transition-colors">
                                        <td className="p-4">
                                            <div className="font-medium text-white">{record.user_name}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="text-primary">{record.activity_name}</div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-textMuted text-sm">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(record.date).toLocaleDateString()} a las {record.time}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(record.status, record.verified_by_fingerprint)}
                                                <span className={`text-sm font-medium ${
                                                    record.verified_by_fingerprint ? 'text-green-400' :
                                                    record.status === 'absent' ? 'text-red-400' :
                                                    record.status === 'late' ? 'text-yellow-400' : 'text-blue-400'
                                                }`}>
                                                    {getStatusText(record.status, record.verified_by_fingerprint)}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AttendanceLogs;
