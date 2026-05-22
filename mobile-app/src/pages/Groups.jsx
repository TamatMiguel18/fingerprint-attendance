import React, { useState, useEffect } from 'react';
import { groupService, userService } from '../services/api';
import { Users, Search, Plus, Trash2, X, ChevronDown, User } from 'lucide-react';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [expandedGroup, setExpandedGroup] = useState(null);

  // Modals
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [newUser, setNewUser] = useState({ name: '', group_id: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [gRes, uRes] = await Promise.all([
        groupService.getAllGroups(),
        userService.getAllUsers(),
      ]);
      setGroups(gRes.data || []);
      setUsers((uRes.data || []).filter(u => u.role === 'student'));
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!newGroup.name.trim()) return;
    setSaving(true);
    try {
      await groupService.createGroup(newGroup);
      setNewGroup({ name: '', description: '' });
      setShowGroupModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.group_id) return;
    setSaving(true);
    try {
      await userService.createUser(newUser);
      setNewUser({ name: '', group_id: '' });
      setShowUserModal(false);
      fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async (id) => {
    try {
      await groupService.deleteGroup(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const getMembersOfGroup = (groupId) =>
    users.filter(u => u.group_id === groupId || u.group_id == groupId);

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* App Bar */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Grupos</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowUserModal(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 text-[#d4af37] border border-[#d4af37]/30 active:scale-95 transition-transform"
            >
              + Miembro
            </button>
            <button
              onClick={() => setShowGroupModal(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[#8b4513]/10 text-[#8b4513] border border-[#8b4513]/20 active:scale-95 transition-transform"
            >
              + Grupo
            </button>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-gray-400" size={18} />
          </div>
          <input
            type="text"
            placeholder="Buscar grupo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mobile-input pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-3 border-[#8b4513]/20 border-t-[#8b4513] rounded-full animate-spin" />
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">No hay grupos</p>
            <p className="text-xs text-gray-400 mt-1">Toca "+ Grupo" para crear el primero</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGroups.map(group => {
              const members = getMembersOfGroup(group.id);
              const isExpanded = expandedGroup === group.id;
              return (
                <div key={group.id} className="mobile-card overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors"
                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#8b4513]/10 rounded-xl flex items-center justify-center shrink-0">
                        <Users size={18} className="text-[#8b4513]" />
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800 text-sm">{group.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{members.length} miembro{members.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                        className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <Trash2 size={14} />
                      </button>
                      <ChevronDown
                        size={18}
                        className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      />
                    </div>
                  </button>

                  {/* Members list */}
                  {isExpanded && (
                    <div className="border-t border-gray-50">
                      {members.length === 0 ? (
                        <p className="text-xs text-gray-400 text-center py-5">Sin miembros aún</p>
                      ) : (
                        members.map(u => (
                          <div key={u.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-50 last:border-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center">
                                <User size={14} className="text-[#d4af37]" />
                              </div>
                              <span className="text-sm text-gray-700 font-medium">{u.name}</span>
                            </div>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="w-7 h-7 rounded-full bg-red-50 text-red-400 flex items-center justify-center active:scale-90 transition-transform"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Create Group */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center p-0">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">Nuevo Grupo</h3>
              <button onClick={() => setShowGroupModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block ml-1">Nombre del grupo</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="mobile-input"
                  placeholder="Ej. Coro Parroquial"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block ml-1">Descripción (opcional)</label>
                <input
                  type="text"
                  value={newGroup.description}
                  onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="mobile-input"
                  placeholder="Descripción breve"
                />
              </div>
              <button type="submit" disabled={saving} className="btn-primary mt-2">
                {saving ? 'Guardando...' : 'Crear Grupo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create User */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-800">Nuevo Feligrés</h3>
              <button onClick={() => setShowUserModal(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block ml-1">Nombre completo</label>
                <input
                  type="text"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                  className="mobile-input"
                  placeholder="Nombre del feligrés"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1.5 block ml-1">Grupo</label>
                <select
                  value={newUser.group_id}
                  onChange={e => setNewUser({ ...newUser, group_id: e.target.value })}
                  className="mobile-input"
                  required
                >
                  <option value="">— Seleccionar grupo —</option>
                  {groups.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
              <button type="submit" disabled={saving} className="btn-primary mt-2">
                {saving ? 'Guardando...' : 'Añadir Miembro'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
