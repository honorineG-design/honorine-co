const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000'
    : 'https://honorine-co.onrender.com';  


async function apiCall(endpoint, options = {}) {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json', ...options.headers },
            ...options
        });
        const data = await res.json();
        return data;
    } catch (err) {
        console.error('API error:', err);
        return { error: 'Connection failed. Is the backend running?' };
    }
}

async function checkAuth() {
    return await apiCall('/api/me');
}

async function registerUser(username, password) {
    return await apiCall('/api/register', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

async function loginUser(username, password) {
    return await apiCall('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username, password })
    });
}

async function logoutUser() {
    return await apiCall('/api/logout', { method: 'POST' });
}

async function analyzeFeedback(text, employee_name, department, rating) {
    return await apiCall('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({ text, employee_name, department, rating })
    });
}

async function getAllFeedback() {
    return await apiCall('/api/feedback');
}

async function getStats() {
    return await apiCall('/api/stats');
}

async function deleteFeedback(id) {
    return await apiCall(`/api/feedback/${id}`, { method: 'DELETE' });
}