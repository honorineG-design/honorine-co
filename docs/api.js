const API_URL = 'honorine-co-production.up.railway.app';

function saveToken(token) { localStorage.setItem('hc_token', token); }
function getToken() { return localStorage.getItem('hc_token'); }
function clearToken() { localStorage.removeItem('hc_token'); localStorage.removeItem('hc_user'); }

async function apiCall(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    try {
        const token = getToken();
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(url, {
            method: options.method || 'GET',
            headers: { ...headers, ...(options.headers || {}) },
            body: options.body || undefined
        });

        const data = await res.json();
        return data;
    } catch (err) {
        console.error('API CALL FAILED:', url, err.message);
        return { error: err.message || 'Connection failed.' };
    }
}

async function checkAuth() {
    const token = getToken();
    if (!token) return { authenticated: false };
    return await apiCall('/api/me');
}

async function registerUser(username, password) {
    return await apiCall('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

async function loginUser(username, password) {
    const result = await apiCall('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
    if (result.token) {
        saveToken(result.token);
        localStorage.setItem('hc_user', JSON.stringify({
            username: result.username,
            is_admin: result.is_admin
        }));
    }
    return result;
}

async function logoutUser() {
    clearToken();
    return { message: 'Logged out' };
}

async function analyzeFeedback(text, employee_name, department, rating) {
    return await apiCall('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ text, employee_name, department, rating })
    });
}

async function getAllFeedback() { return await apiCall('/api/feedback'); }
async function getStats() { return await apiCall('/api/stats'); }
async function deleteFeedback(id) {
    return await apiCall(`/api/feedback/${id}`, { method: 'DELETE' });
}
