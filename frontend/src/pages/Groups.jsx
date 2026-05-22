import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2 } from 'lucide-react';

const Groups = () => {
    const [groups, setGroups] = useState([]);
    const [users, setUsers] = useState([]);
    const [newGroup, setNewGroup] = useState({ name: '', description: '' });
    const [newUser, setNewUser] = useState({ name: '', group_id: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const [gRes, uRes] = await Promise.all([api.get('/groups'), api.get('/users')]);
        setGroups(gRes.data);
        setUsers(uRes.data);
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        await api.post('/groups', newGroup);
        setNewGroup({ name: '', description: '' });
        fetchData();
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        await api.post('/users', { ...newUser, role: 'student' });
        setNewUser({ name: '', group_id: '' });
        fetchData();
    };

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Grupos Parroquiales y Miembros</h1>
                <p className="text-textMuted text-sm md:text-base">Administra tus grupos y registra nuevos feligreses.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
                {/* Groups Section */}
                <div className="glass-panel p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-4">Grupos</h2>
                    <form onSubmit={handleCreateGroup} className="flex flex-col sm:flex-row gap-2 mb-6">
                        <input 
                            type="text" 
                            placeholder="Nombre del Grupo (ej. Coro)" 
                            className="glass-input flex-1"
                            value={newGroup.name}
                            onChange={e => setNewGroup({...newGroup, name: e.target.value})}
                            required 
                        />
                        <button type="submit" className="glass-button-primary flex justify-center items-center py-3 sm:py-2">
                            <Plus className="w-5 h-5" /> <span className="sm:hidden ml-2">Añadir Grupo</span>
                        </button>
                    </form>
                    <div className="space-y-2">
                        {groups.map(g => (
                            <div key={g.id} className="p-3 bg-surface rounded-lg flex justify-between items-center">
                                <span>{g.name}</span>
                                <button onClick={() => { api.delete(`/groups/${g.id}`).then(fetchData) }} className="text-red-400 hover:text-red-300 p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {groups.length === 0 && <p className="text-sm text-textMuted text-center py-4">No hay grupos creados.</p>}
                    </div>
                </div>

                {/* Users Section */}
                <div className="glass-panel p-4 md:p-6">
                    <h2 className="text-lg md:text-xl font-bold text-white mb-4">Miembros (Feligreses)</h2>
                    <form onSubmit={handleCreateUser} className="space-y-3 mb-6">
                        <input 
                            type="text" placeholder="Nombre Completo" className="glass-input" required
                            value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})}
                        />
                        <select 
                            className="glass-input bg-surface" required
                            value={newUser.group_id} onChange={e => setNewUser({...newUser, group_id: e.target.value})}
                        >
                            <option value="">-- Seleccionar Grupo --</option>
                            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                        </select>
                        <button type="submit" className="glass-button-primary w-full py-3">Añadir Miembro</button>
                    </form>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                        {users.filter(u => u.role === 'student').map(u => (
                            <div key={u.id} className="p-3 bg-surface rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="font-medium text-sm">{u.name}</p>
                                    <p className="text-xs text-textMuted">{u.group_name || 'Sin grupo'}</p>
                                </div>
                                <button onClick={() => { api.delete(`/users/${u.id}`).then(fetchData) }} className="text-red-400 p-2">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Groups;
