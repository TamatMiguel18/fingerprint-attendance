import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const Activities = () => {
    const [activities, setActivities] = useState([]);
    const [groups, setGroups] = useState([]);
    const [newActivity, setNewActivity] = useState({ name: '', date: '', groupId: '', requiresFingerprint: true });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [aRes, gRes] = await Promise.all([api.get('/activities'), api.get('/groups')]);
        setActivities(aRes.data);
        setGroups(gRes.data);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        await api.post('/activities', newActivity);
        setNewActivity({ name: '', date: '', groupId: '', requiresFingerprint: true });
        fetchData();
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Eventos Parroquiales</h1>
                <p className="text-textMuted text-sm md:text-base">Crea reuniones o eventos para tomar asistencia a un grupo específico.</p>
            </header>

            <div className="glass-panel p-4 md:p-6">
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <input type="text" placeholder="Nombre del Evento (ej. Retiro)" className="glass-input" required
                        value={newActivity.name} onChange={e => setNewActivity({...newActivity, name: e.target.value})} />
                    <input type="date" className="glass-input" required
                        value={newActivity.date} onChange={e => setNewActivity({...newActivity, date: e.target.value})} />
                    <select className="glass-input bg-surface" required
                        value={newActivity.groupId} onChange={e => setNewActivity({...newActivity, groupId: e.target.value})}>
                        <option value="">-- Seleccionar Grupo --</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                    </select>
                    <button type="submit" className="glass-button-primary flex items-center justify-center gap-2 py-3 md:py-2">
                        <Plus className="w-5 h-5" /> Crear Evento
                    </button>
                </form>

                <div className="space-y-3">
                    {activities.map(a => (
                        <div key={a.id} className="p-4 bg-surface rounded-lg flex flex-col sm:flex-row justify-between sm:items-center hover:bg-surfaceHover transition gap-4">
                            <div>
                                <h3 className="font-bold text-white text-lg">{a.name}</h3>
                                <p className="text-sm text-primary">{new Date(a.date).toLocaleDateString()} • {a.group_name}</p>
                            </div>
                            <button onClick={() => { api.delete(`/activities/${a.id}`).then(fetchData) }} className="self-end sm:self-auto p-2 text-red-400 hover:bg-red-400/10 rounded-lg">
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                    {activities.length === 0 && (
                        <p className="text-center text-textMuted py-8">No hay eventos creados todavía.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Activities;
