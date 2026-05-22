import React, { useState, useEffect } from 'react';
import { attendanceService, activityService } from '../services/api';
import { Calendar, CheckCircle, XCircle, Clock, Filter, ChevronDown } from 'lucide-react';

const AttendanceLogs = () => {
  const [records, setRecords] = useState([]);
  const [activities, setActivities] = useState([]);
  const [filterActivity, setFilterActivity] = useState('');
  const [loading, setLoading] = useState(true);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, actRes] = await Promise.all([
          attendanceService.getAllAttendance(),
          activityService.getAllActivities(),
        ]);
        setRecords(attRes.data || []);
        setActivities(actRes.data || []);
      } catch (err) {
        console.error('Error:', err);
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
    if (verified) return <CheckCircle size={16} className="text-green-500" />;
    if (status === 'absent') return <XCircle size={16} className="text-red-400" />;
    if (status === 'late') return <Clock size={16} className="text-yellow-500" />;
    return <CheckCircle size={16} className="text-blue-400" />;
  };

  const getStatusLabel = (status, verified) => {
    if (verified) return { text: 'Huella', color: 'bg-green-50 text-green-700' };
    if (status === 'present') return { text: 'Manual', color: 'bg-blue-50 text-blue-700' };
    if (status === 'late') return { text: 'Tarde', color: 'bg-yellow-50 text-yellow-700' };
    return { text: 'Ausente', color: 'bg-red-50 text-red-700' };
  };

  const selectedActivityName = activities.find(a => a.id == filterActivity)?.name;

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* App Bar */}
      <div className="bg-white px-5 pt-12 pb-4 shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Historial</h1>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors ${
              filterActivity
                ? 'bg-[#8b4513]/10 text-[#8b4513] border-[#8b4513]/20'
                : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            <Filter size={14} />
            {filterActivity ? selectedActivityName?.split(' ').slice(0,2).join(' ') : 'Filtrar'}
          </button>
        </div>

        {showFilter && (
          <div className="relative">
            <select
              value={filterActivity}
              onChange={e => { setFilterActivity(e.target.value); setShowFilter(false); }}
              className="mobile-input pr-10 appearance-none"
            >
              <option value="">— Todos los eventos —</option>
              {activities.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <p className="text-sm text-gray-400">
            {loading ? '...' : `${filteredRecords.length} registro${filteredRecords.length !== 1 ? 's' : ''}`}
          </p>
          {filterActivity && (
            <button
              onClick={() => setFilterActivity('')}
              className="text-xs text-[#8b4513] font-semibold"
            >
              Limpiar filtro
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="px-5 py-4">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} className="text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">Sin registros</p>
            <p className="text-xs text-gray-400 mt-1">No hay asistencia registrada aún.</p>
          </div>
        ) : (
          <div className="mobile-card divide-y divide-gray-50 overflow-hidden">
            {filteredRecords.map(record => {
              const label = getStatusLabel(record.status, record.verified_by_fingerprint);
              return (
                <div key={record.id} className="flex items-center gap-3 p-4">
                  <div className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center shrink-0">
                    {getStatusIcon(record.status, record.verified_by_fingerprint)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-800 truncate">{record.user_name}</p>
                    <p className="text-xs text-gray-400 truncate">{record.activity_name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Calendar size={11} className="text-gray-300" />
                      <span className="text-[11px] text-gray-400">
                        {new Date(record.date).toLocaleDateString('es', { day: '2-digit', month: 'short' })} · {record.time}
                      </span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${label.color}`}>
                    {label.text}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceLogs;
