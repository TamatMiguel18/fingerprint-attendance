import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, CalendarDays, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalGroups: 0,
        totalUsers: 0,
        totalActivities: 0,
        recentAttendance: []
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [gRes, uRes, aRes, attRes] = await Promise.all([
                    api.get('/groups'),
                    api.get('/users'),
                    api.get('/activities'),
                    api.get('/attendance')
                ]);

                setStats({
                    totalGroups: gRes.data.length,
                    totalUsers: uRes.data.filter(u => u.role === 'student').length,
                    totalActivities: aRes.data.length,
                    recentAttendance: attRes.data.slice(0, 5) // Get latest 5
                });
            } catch (error) {
                console.error("Error fetching dashboard data", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="space-y-6 md:space-y-8 pb-10">
            <header>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Panel Principal</h1>
                <p className="text-textMuted text-sm md:text-base">Resumen de la asistencia y eventos de la parroquia.</p>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="p-4 bg-primary/20 rounded-full">
                        <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <p className="text-textMuted text-sm">Feligreses Activos</p>
                        <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4">
                    <div className="p-4 bg-accent/20 rounded-full">
                        <Users className="w-8 h-8 text-accent" />
                    </div>
                    <div>
                        <p className="text-textMuted text-sm">Grupos Parroquiales</p>
                        <p className="text-3xl font-bold text-white">{stats.totalGroups}</p>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 sm:col-span-2 lg:col-span-1">
                    <div className="p-4 bg-green-500/20 rounded-full">
                        <CalendarDays className="w-8 h-8 text-green-400" />
                    </div>
                    <div>
                        <p className="text-textMuted text-sm">Eventos Totales</p>
                        <p className="text-3xl font-bold text-white">{stats.totalActivities}</p>
                    </div>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="glass-panel p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-white mb-6">Asistencia Reciente</h2>
                <div className="space-y-4">
                    {stats.recentAttendance.length === 0 ? (
                        <p className="text-textMuted text-center py-4">Aún no hay registros de asistencia.</p>
                    ) : (
                        stats.recentAttendance.map(record => (
                            <div key={record.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-border">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${record.verified_by_fingerprint ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {record.verified_by_fingerprint ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="font-medium text-white">{record.user_name}</p>
                                        <p className="text-sm text-textMuted">{record.activity_name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-white">{record.time}</p>
                                    <p className="text-xs text-textMuted">{new Date(record.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
