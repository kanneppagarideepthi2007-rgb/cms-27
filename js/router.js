import { auth } from './auth.js';
import { renderLogin } from './modules/login.js';
import { renderStudentDashboard } from './modules/student.js';
import { renderFacultyDashboard } from './modules/faculty.js';
import { renderAdminDashboard } from './modules/admin.js';

const app = document.getElementById('main-content');

export const router = {
    routes: {},

    addRoute(path, renderFn) {
        this.routes[path] = renderFn;
    },

    async handleRoute() {
        const hash = window.location.hash.slice(1) || 'login';

        // Auth Guard
        if (!auth.isAuthenticated() && hash !== 'login') {
            window.location.hash = '#login';
            return;
        }

        // Role Guard (Basic)
        if (auth.isAuthenticated() && hash === 'login') {
            const role = auth.getCurrentUser().role;
            window.location.hash = `#${role}/dashboard`;
            return;
        }

        const [base] = hash.split('/');

        const routeMap = {
            'login': renderLogin,
            'student': renderStudentDashboard,
            'faculty': renderFacultyDashboard,
            'admin': renderAdminDashboard
        };

        const renderFn = routeMap[base] || this.routes['404'];

        if (renderFn) {
            // Apply Transition
            app.classList.remove('fade-in');
            void app.offsetWidth; // Trigger reflow
            app.classList.add('fade-in');

            // Render
            app.innerHTML = await renderFn();

            // Post-render hooks (charts, event listeners)
            this.postRender(path);
        }

        auth.applyTheme();
    },

    postRender(path) {
        // Simple event delegation or module-specific init hooks could go here
        // For this prototype, we'll dispatch a custom event
        const event = new CustomEvent('viewLoaded', { detail: { path } });
        document.dispatchEvent(event);
    },

    init() {
        // Register default 404 if not present (handled dynamically above now, but good practice to keep)
        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }
};

// 404 View
router.routes['404'] = () => `
    <div class="container text-center" style="margin-top: 20vh;">
        <h1>404</h1>
        <p>Page not found</p>
        <a href="#login" class="btn btn-primary mt-4">Go Back</a>
    </div>
`;

// Initialize
router.init();
