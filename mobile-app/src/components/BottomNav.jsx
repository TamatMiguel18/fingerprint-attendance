import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Fingerprint, ClipboardList, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: '/dashboard', icon: <Home size={22} />, label: 'Inicio' },
    { to: '/groups', icon: <Users size={22} />, label: 'Grupos' },
    { to: '/kiosk', icon: <Fingerprint size={22} />, label: 'Asistencia' },
    { to: '/logs', icon: <ClipboardList size={22} />, label: 'Historial' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex justify-around items-center h-[64px] max-w-md mx-auto px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center flex-1 h-full space-y-1 transition-all duration-150 ${
                isActive ? 'text-[#8b4513]' : 'text-gray-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`transition-transform duration-150 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  {isActive && item.to === '/kiosk' ? (
                    <div className="w-12 h-12 bg-[#8b4513] rounded-full flex items-center justify-center -mt-6 shadow-lg shadow-[#8b4513]/30">
                      <Fingerprint size={24} className="text-white" />
                    </div>
                  ) : item.icon}
                </div>
                {!(isActive && item.to === '/kiosk') && (
                  <span className={`text-[10px] font-medium leading-none ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                )}
                {isActive && item.to === '/kiosk' && (
                  <span className="text-[10px] font-semibold text-[#8b4513] leading-none mt-1">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 h-full space-y-1 text-gray-400 hover:text-red-500 transition-colors"
        >
          <LogOut size={22} />
          <span className="text-[10px] font-medium">Salir</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
