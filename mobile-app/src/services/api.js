import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.1.1:3000/api', // <-- CAMBIA ESTA IP por la IP local de tu PC
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const groupService = {
    getAllGroups: () => api.get('/groups'),
    createGroup: (data) => api.post('/groups', data),
    deleteGroup: (id) => api.delete(`/groups/${id}`),
};

export const userService = {
    getAllUsers: () => api.get('/users'),
    createUser: (data) => api.post('/users', { ...data, role: 'student' }),
    deleteUser: (id) => api.delete(`/users/${id}`),
};

export const activityService = {
    getAllActivities: () => api.get('/activities'),
};

export const attendanceService = {
    getAllAttendance: () => api.get('/attendance'),
};

export const webAuthnService = {
    getRegistrationOptions: (userId) => api.get(`/webauthn/generate-registration-options/${userId}`),
    verifyRegistration: (userId, data) => api.post(`/webauthn/verify-registration/${userId}`, data),
    getAuthOptions: (userId) => api.get(`/webauthn/generate-authentication-options/${userId}`),
    verifyAuth: (userId, activityId, data) => api.post(`/webauthn/verify-authentication/${userId}/${activityId}`, data),
};

export default api;
