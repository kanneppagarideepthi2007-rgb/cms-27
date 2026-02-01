import { auth } from '../auth.js';
import { store } from '../store.js';

export function renderStudentDashboard() {
    const user = auth.getCurrentUser();
    if (!user) return '';

    const attendance = store.getStudentAttendance(user.id);
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'present').length;
    const percentage = totalClasses ? Math.round((presentClasses / totalClasses) * 100) : 0;

    // Determine color based on threshold
    let colorVar = '--theme-student';
    if (percentage < 75) colorVar = '#e53e3e'; // Red warning
    else if (percentage < 85) colorVar = '#dd6b20'; // Orange warning

    return `
        <header class="flex-between mb-4 fade-in">
            <div>
                <h1>Student Dashboard</h1>
                <p class="text-muted">Welcome, ${user.name}</p>
            </div>
            <button id="logout-btn" class="btn btn-outline">Logout</button>
        </header>

        <div class="grid-2 fade-in delay-100">
            <!-- Attendance Card -->
            <div class="card">
                <h3>Attendance Overview</h3>
                <div class="flex-between">
                    <div>
                        <div style="font-size: 3rem; font-weight: bold; color: var(${colorVar});">
                            ${percentage}%
                        </div>
                        <p class="text-muted">${presentClasses} / ${totalClasses} Classes Attended</p>
                    </div>
                    <!-- CSS Conic Gradient Ring -->
                    <div style="
                        width: 100px; 
                        height: 100px; 
                        border-radius: 50%; 
                        background: conic-gradient(var(${colorVar}) ${percentage}%, #e2e8f0 0);
                        display: flex; 
                        align-items: center; 
                        justify-content: center;
                    ">
                        <div style="width: 80px; height: 80px; background: white; border-radius: 50%;"></div>
                    </div>
                </div>
            </div>

            <!-- Notifications / Recent Activity -->
            <div class="card">
                <h3>Recent Activity</h3>
                <ul style="list-style: none;">
                    ${attendance.slice(-3).reverse().map(a => `
                        <li style="padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between;">
                            <span>${a.date} (${a.courseId})</span>
                            <span style="
                                color: ${a.status === 'present' ? 'green' : 'red'}; 
                                font-weight: bold; 
                                text-transform: capitalize;
                            ">${a.status}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>

        <h3 class="mt-4 mb-4">My Courses</h3>
        <div class="grid-2 fade-in delay-200">
             ${store.data.courses.map(c => `
                <div class="card hover-lift">
                    <h4>${c.name}</h4>
                    <p class="text-muted">ID: ${c.id}</p>
                    <div style="margin-top: 1rem;">
                        <strong>Materials:</strong>
                        <ul style="font-size: 0.9rem; margin-top: 0.5rem; padding-left: 1.2rem;">
                            ${store.getCourseMaterials(c.id).map(m => `
                                <li><a href="${m.link}" style="color: var(--theme-primary);">${m.title}</a></li>
                            `).join('') || '<li>No materials yet</li>'}
                        </ul>
                    </div>
                </div>
             `).join('')}
        </div>

        <h3 class="mt-4 mb-4">Exam Results</h3>
        <div class="card fade-in delay-300">
            <table style="width: 100%; border-collapse: collapse;">
                <thead>
                    <tr style="text-align: left; border-bottom: 2px solid var(--color-border);">
                        <th style="padding: 1rem;">Course</th>
                        <th>Exam</th>
                        <th>Score</th>
                        <th>Total</th>
                        <th>%</th>
                    </tr>
                </thead>
                <tbody>
                    ${store.getStudentGrades(user.id).map(g => `
                        <tr style="border-bottom: 1px solid var(--color-border);">
                            <td style="padding: 1rem;">${g.courseId}</td>
                            <td>${g.type}</td>
                            <td>${g.score}</td>
                            <td>${g.total}</td>
                            <td style="font-weight: bold; color: ${g.score / g.total >= 0.75 ? 'green' : 'red'}">
                                ${Math.round((g.score / g.total) * 100)}%
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Event Bindings
document.addEventListener('viewLoaded', (e) => {
    if (e.detail.path === 'student') {
        document.getElementById('logout-btn')?.addEventListener('click', () => auth.logout());
    }
});
