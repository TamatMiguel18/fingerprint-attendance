import { useState } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Fingerprint, Users, CalendarDays, LayoutDashboard, LogOut, CheckCircle, Menu, X } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-background relative overflow-hidden">
            
            {/* Mobile Header */}
            <div className="md:hidden absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-background/80 backdrop-blur-md border-b border-border">
                <div className="flex items-center gap-2">
                    <Fingerprint className="text-primary w-6 h-6" />
                    <span className="font-bold">Asistencia Parroquial</span>
                </div>
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-text">
                    {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar */}
            <aside className={`
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
                md:translate-x-0
                fixed md:static inset-y-0 left-0 z-30 w-64 glass-panel m-0 md:m-4 flex flex-col transition-transform duration-300
            `}>
                <div className="p-6 flex items-center gap-3 border-b border-border">
                    <div className="p-2 bg-primary/20 rounded-lg">
                        <Fingerprint className="text-primary w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="font-bold text-lg leading-tight">Asistencia Parroquial</h1>
                        <p className="text-xs text-textMuted capitalize">{user.role}</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <Link onClick={() => setSidebarOpen(false)} to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surfaceHover transition-colors">
                        <LayoutDashboard className="w-5 h-5 text-textMuted" />
                        <span>Panel Principal</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/groups" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surfaceHover transition-colors">
                        <Users className="w-5 h-5 text-textMuted" />
                        <span>Grupos y Miembros</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/activities" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surfaceHover transition-colors">
                        <CalendarDays className="w-5 h-5 text-textMuted" />
                        <span>Eventos</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/logs" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surfaceHover transition-colors">
                        <CheckCircle className="w-5 h-5 text-textMuted" />
                        <span>Historial Asistencia</span>
                    </Link>
                    <Link onClick={() => setSidebarOpen(false)} to="/kiosk" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surfaceHover transition-colors text-primary font-medium border border-primary/20 bg-primary/5">
                        <Fingerprint className="w-5 h-5" />
                        <span>Tomar Asistencia</span>
                    </Link>
                </nav>

                <div className="p-4 border-t border-border">
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-lg hover:bg-red-500/10 text-red-400 transition-colors mb-2"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Cerrar Sesión</span>
                    </button>
                    <div className="text-center text-[10px] text-textMuted/60 uppercase tracking-widest mt-2 border-t border-border/50 pt-2">
                        &copy; 2026 Miguel Antonio Tamat
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-20 md:hidden" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-16 md:mt-0 relative">
                <div className="absolute inset-0 bg-glass-gradient opacity-50 pointer-events-none" />
                <div className="relative z-10">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
