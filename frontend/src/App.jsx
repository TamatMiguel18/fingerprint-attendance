import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Activities from './pages/Activities';
import Kiosk from './pages/Kiosk';
import AttendanceLogs from './pages/AttendanceLogs';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return <div className="h-screen flex items-center justify-center text-text">Loading...</div>;
    return user ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
                <Route index element={<Dashboard />} />
                <Route path="groups" element={<Groups />} />
                <Route path="activities" element={<Activities />} />
                <Route path="logs" element={<AttendanceLogs />} />
                <Route path="kiosk" element={<Kiosk />} />
            </Route>
        </Routes>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
};

export default App;
