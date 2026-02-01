import { auth } from '../auth.js';
import { store } from '../store.js';

export function renderFacultyDashboard() {
    const user = auth.getCurrentUser();
    if (!user) return '';

    return `
        <header class="flex-between mb-4 fade-in">
            <div>
                <h1>Faculty Dashboard</h1>
                <p class="text-muted">Instructor: ${user.name}</p>
            </div>
            <button id="logout-btn" class="btn btn-outline">Logout</button>
        </header>

        <div class="card fade-in delay-100 mb-4">
            <div class="flex-between">
                <h3>Mark Attendance</h3>
                <select id="course-select" style="width: auto;">
                    ${store.data.courses.filter(c => c.facultyId === user.id).map(c =>
        `<option value="${c.id}">${c.name}</option>`
    ).join('')}
                </select>
            </div>
            
            <div class="mt-4">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="text-align: left; border-bottom: 2px solid var(--color-border);">
                            <th style="padding: 1rem;">Student ID</th>
                            <th>Name</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${store.data.users.filter(u => u.role === 'student').map(s => `
                            <tr style="border-bottom: 1px solid var(--color-border);">
                                <td style="padding: 1rem;">${s.id}</td>
                                <td>${s.name}</td>
                                <td>
                                    <div style="display: flex; gap: 1rem;">
                                        <label style="display: flex; align-items: center; gap: 0.5rem; color: green; cursor: pointer;">
                                            <input type="radio" name="att-${s.id}" value="present" checked> P
                                        </label>
                                        <label style="display: flex; align-items: center; gap: 0.5rem; color: red; cursor: pointer;">
                                            <input type="radio" name="att-${s.id}" value="absent"> A
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="text-center mt-4">
                    <button id="submit-attendance" class="btn btn-primary">Save Attendance</button>
                </div>
            </div>
        </div>

        <div class="grid-2 fade-in delay-200">
            <!-- Marks Entry -->
            <div class="card">
                <h3>Enter Marks</h3>
                <div class="form-group mt-4">
                    <select id="grade-course" style="margin-bottom: 1rem;">
                        ${store.data.courses.filter(c => c.facultyId === user.id).map(c =>
        `<option value="${c.id}">${c.name}</option>`
    ).join('')}
                    </select>
                    <input type="text" id="grade-student-id" placeholder="Student ID (e.g., s1)" class="mb-4" />
                    <input type="text" id="grade-type" placeholder="Exam Type (Midterm/Final)" class="mb-4" />
                    <input type="number" id="grade-score" placeholder="Score" class="mb-4" />
                    <button id="submit-grade" class="btn btn-outline" style="width: 100%">Submit Grade</button>
                </div>
            </div>

            <!-- Upload Materials -->
            <div class="card">
                <h3>Upload Materials</h3>
                <div class="form-group mt-4">
                    <select id="material-course" style="margin-bottom: 1rem;">
                        ${store.data.courses.filter(c => c.facultyId === user.id).map(c =>
        `<option value="${c.id}">${c.name}</option>`
    ).join('')}
                    </select>
                    <input type="text" id="material-title" placeholder="Material Title" class="mb-4" />
                    <input type="text" id="material-link" placeholder="Link/URL" class="mb-4" />
                    <button id="submit-material" class="btn btn-outline" style="width: 100%">Upload Resource</button>
                </div>
            </div>
        </div>
    `;
}

// Event Bindings
document.addEventListener('viewLoaded', (e) => {
    if (e.detail.path === 'faculty') {
        document.getElementById('logout-btn')?.addEventListener('click', () => auth.logout());

        document.getElementById('submit-attendance')?.addEventListener('click', () => {
            const courseId = document.getElementById('course-select').value;
            const students = store.data.users.filter(u => u.role === 'student');
            const date = new Date().toISOString().split('T')[0];

            students.forEach(s => {
                const statusInput = document.querySelector(`input[name="att-${s.id}"]:checked`);
                if (statusInput) {
                    store.markAttendance({
                        courseId,
                        studentId: s.id,
                        date,
                        status: statusInput.value
                    });
                }
            });

            alert('Attendance Saved Successfully!');
        });

        document.getElementById('submit-grade')?.addEventListener('click', () => {
            const courseId = document.getElementById('grade-course').value;
            const studentId = document.getElementById('grade-student-id').value;
            const type = document.getElementById('grade-type').value;
            const score = document.getElementById('grade-score').value;

            if (studentId && score) {
                store.addGrade({ courseId, studentId, type, score: Number(score), total: 100 });
                alert('Grade Added!');
            }
        });

        document.getElementById('submit-material')?.addEventListener('click', () => {
            const courseId = document.getElementById('material-course').value;
            const title = document.getElementById('material-title').value;
            const link = document.getElementById('material-link').value;

            if (title && link) {
                store.addMaterial({ courseId, title, link });
                alert('Material Uploaded!');
            }
        });
    }
});
