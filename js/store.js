/**
 * Mock Database & Store
 * Simulates a backend using LocalStorage
 */

const DB_KEY = 'cms_db_v1';

const INITIAL_DATA = {
    users: [
        { id: 's1', username: 'student', password: 'pass', role: 'student', name: 'Alex Johnson', dept: 'CS' },
        { id: 'f1', username: 'faculty', password: 'pass', role: 'faculty', name: 'Dr. Sarah Smith', dept: 'CS' },
        { id: 'a1', username: 'admin', password: 'pass', role: 'admin', name: 'Admin user', dept: 'Admin' }
    ],
    attendance: [
        { courseId: 'cs101', studentId: 's1', date: '2023-10-01', status: 'present' },
        { courseId: 'cs101', studentId: 's1', date: '2023-10-02', status: 'absent' },
        { courseId: 'cs101', studentId: 's1', date: '2023-10-03', status: 'present' },
        { courseId: 'cs101', studentId: 's1', date: '2023-10-04', status: 'present' },
        { courseId: 'cs101', studentId: 's1', date: '2023-10-05', status: 'late' }
    ],
    courses: [
        { id: 'cs101', name: 'Intro to CS', facultyId: 'f1' },
        { id: 'cs102', name: 'Data Structures', facultyId: 'f1' }
    ],
    grades: [
        { studentId: 's1', courseId: 'cs101', type: 'Midterm', score: 85, total: 100 },
        { studentId: 's1', courseId: 'cs101', type: 'Final', score: 88, total: 100 }
    ],
    materials: [
        { courseId: 'cs101', title: 'Syllabus', link: '#' },
        { courseId: 'cs101', title: 'Lecture 1 Slides', link: '#' }
    ]
};

class Store {
    constructor() {
        if (!localStorage.getItem(DB_KEY)) {
            localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
        }
        this.data = JSON.parse(localStorage.getItem(DB_KEY));
    }

    save() {
        localStorage.setItem(DB_KEY, JSON.stringify(this.data));
    }

    // User Methods
    authenticate(username, password) {
        return this.data.users.find(u => u.username === username && u.password === password);
    }

    getUser(id) {
        return this.data.users.find(u => u.id === id);
    }

    // Attendance Methods
    getStudentAttendance(studentId) {
        return this.data.attendance.filter(a => a.studentId === studentId);
    }

    markAttendance(record) {
        this.data.attendance.push(record);
        this.save();
    }

    // Grades Methods
    getStudentGrades(studentId) {
        return this.data.grades.filter(g => g.studentId === studentId);
    }

    addGrade(grade) {
        this.data.grades.push(grade);
        this.save();
    }

    // Materials Methods
    getCourseMaterials(courseId) {
        return this.data.materials.filter(m => m.courseId === courseId);
    }

    addMaterial(material) {
        this.data.materials.push(material);
        this.save();
    }

    // Course Management
    addCourse(course) {
        this.data.courses.push(course);
        this.save();
    }
}

export const store = new Store();
