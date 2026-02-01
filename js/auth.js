import { store } from './store.js';

class AuthService {
    constructor() {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser')) || null;
    }

    login(username, password) {
        const user = store.authenticate(username, password);
        if (user) {
            this.currentUser = user;
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    }

    logout() {
        this.currentUser = null;
        sessionStorage.removeItem('currentUser');
        window.location.hash = '#login';
    }

    isAuthenticated() {
        return !!this.currentUser;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Helper to apply theme based on role
    applyTheme() {
        const role = this.currentUser ? this.currentUser.role : 'default';
        document.body.setAttribute('data-theme', role);
    }
}

export const auth = new AuthService();
