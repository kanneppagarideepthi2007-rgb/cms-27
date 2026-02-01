import { auth } from '../auth.js';

export function renderLogin() {
    return `
        <div class="container" style="max-width: 400px; margin-top: 15vh;">
            <div class="card slide-up">
                <h2 class="text-center mb-4">Welcome Back</h2>
                <form id="login-frame">
                    <div class="form-group">
                        <label>Username</label>
                        <input type="text" id="username" placeholder="Enter username" /> 
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="password" placeholder="Enter password" />
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%">Sign In</button>
                    <p class="text-center mt-4" style="font-size: 0.8rem; color: #718096;">
                        Try: <b>student/pass</b>, <b>faculty/pass</b>, or <b>admin/pass</b>
                    </p>
                </form>
            </div>
        </div>
    `;
}

// Bind events after render
document.addEventListener('viewLoaded', (e) => {
    if (e.detail.path === 'login') {
        const form = document.querySelector('#login-frame');
        if (form) {
            form.addEventListener('submit', (evt) => {
                evt.preventDefault();
                const u = document.querySelector('#username').value;
                const p = document.querySelector('#password').value;
                const result = auth.login(u, p);

                if (result.success) {
                    window.location.hash = `#${result.user.role}/dashboard`;
                } else {
                    alert(result.message);
                }
            });
        }
    }
});
