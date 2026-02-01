import { auth } from '../auth.js';
import { store } from '../store.js';

export function renderAdminDashboard() {
    const user = auth.getCurrentUser();
    if (!user) return '';

    const totalStudents = store.data.users.filter(u => u.role === 'student').length;
    const totalFaculty = store.data.users.filter(u => u.role === 'faculty').length;
    const totalCourses = store.data.courses.length;

    return `
        <header class="flex-between mb-4 fade-in">
            <div>
                <h1>Admin Portal</h1>
                <p class="text-muted">System Overview</p>
            </div>
            <button id="logout-btn" class="btn btn-outline">Logout</button>
        </header>

        <!-- Stats Grid -->
        <div class="grid-2 fade-in delay-100" style="grid-template-columns: repeat(3, 1fr);">
            <div class="card text-center hover-lift">
                <h2 style="font-size: 2.5rem; color: var(--theme-primary);">${totalStudents}</h2>
                <p>Students</p>
            </div>
            <div class="card text-center hover-lift">
                <h2 style="font-size: 2.5rem; color: var(--theme-primary);">${totalFaculty}</h2>
                <p>Faculty</p>
            </div>
            <div class="card text-center hover-lift">
                <h2 style="font-size: 2.5rem; color: var(--theme-primary);">${totalCourses}</h2>
                <p>Courses</p>
            </div>
        </div>

        <div class="card mt-4 fade-in delay-200">
            <h3>User Management</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 1rem;">
                <thead>
                    <tr style="text-align: left; border-bottom: 2px solid var(--color-border);">
                        <th style="padding: 1rem;">ID</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Dept</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    ${store.data.users.map(u => `
                        <tr style="border-bottom: 1px solid var(--color-border);">
                            <td style="padding: 1rem;">${u.id}</td>
                            <td>${u.name}</td>
                            <td><span style="
                                padding: 0.25rem 0.5rem; 
                                border-radius: 99px; 
                                background: var(--color-bg); 
                                font-size: 0.8rem;
                                text-transform: uppercase;
                            ">${u.role}</span></td>
                            <td>${u.dept}</td>
                            <td>
                                <button class="btn btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem">Edit</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>

        <div class="card mt-4 fade-in delay-300">
            <h3>Course Management</h3>
            <div class="grid-2 mt-4">
                <input type="text" id="new-course-name" placeholder="Course Name" />
                <input type="text" id="new-course-id" placeholder="Course ID (e.g., cs103)" />
                <button id="add-course-btn" class="btn btn-primary">Add New Course</button>
            </div>
        </div>
    `;
}

// Event Bindings
document.addEventListener('viewLoaded', (e) => {
    if (e.detail.path === 'admin') {
        document.getElementById('logout-btn')?.addEventListener('click', () => auth.logout());

        document.getElementById('add-course-btn')?.addEventListener('click', () => {
            const name = document.getElementById('new-course-name').value;
            const id = document.getElementById('new-course-id').value;

            if (name && id) {
                store.addCourse({ id, name, facultyId: 'f1' }); // Default to f1 for prototype
                alert('Course Added Successfully!');
                // Reload view to show stats update (simple refresh)
                location.reload();
            }
        });
    }
});
