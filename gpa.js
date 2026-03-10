/**
 * GPA Calculator Functions
 */
let courseCounter = 1;

/**
 * Add a new course row
 */
function addCourse() {
    courseCounter++;
    const courseInputs = document.getElementById('courseInputs');
    const courseRow = document.createElement('div');
    courseRow.className = 'course-row';
    courseRow.innerHTML = `
        <div class="input-group">
            <label>Course Name</label>
            <input type="text" placeholder="e.g., Computer Science 101" class="course-name">
        </div>
        <div class="input-group">
            <label>Credits</label>
            <input type="number" min="0" max="6" step="0.5" placeholder="3" class="course-credits">
        </div>
        <div class="input-group">
            <label>Grade</label>
            <select class="course-grade">
                <option value="">Select Grade</option>
                <option value="4.0">A (4.0)</option>
                <option value="3.7">A- (3.7)</option>
                <option value="3.3">B+ (3.3)</option>
                <option value="3.0">B (3.0)</option>
                <option value="2.7">B- (2.7)</option>
                <option value="2.3">C+ (2.3)</option>
                <option value="2.0">C (2.0)</option>
                <option value="1.7">C- (1.7)</option>
                <option value="1.3">D+ (1.3)</option>
                <option value="1.0">D (1.0)</option>
                <option value="0.0">F (0.0)</option>
            </select>
        </div>
        <button class="remove-course" onclick="removeCourse(this)">×</button>
    `;
    courseInputs.appendChild(courseRow);
}

/**
 * Remove a course row
 */
function removeCourse(button) {
    const courseRow = button.parentElement;
    courseRow.remove();
    updateCourseLabels();
}

/**
 * Update course labels after removal (if needed)
 */
function updateCourseLabels() {
    const courseRows = document.querySelectorAll('.course-row');
    courseCounter = courseRows.length;
}

/**
 * Calculate GPA
 */
function calculateGPA() {
    const courseRows = document.querySelectorAll('.course-row');
    let totalPoints = 0;
    let totalCredits = 0;
    let validCourses = 0;

    courseRows.forEach(row => {
        const credits = parseFloat(row.querySelector('.course-credits').value);
        const grade = parseFloat(row.querySelector('.course-grade').value);

        if (!isNaN(credits) && credits > 0 && !isNaN(grade)) {
            totalPoints += credits * grade;
            totalCredits += credits;
            validCourses++;
        }
    });

    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    const gpaPercentage = Math.min((parseFloat(gpa) / 4.0) * 100, 100);

    // Update display
    const gpaDisplay = document.getElementById('gpaDisplay');
    const gpaFill = document.getElementById('gpaFill');
    const totalCreditsEl = document.getElementById('totalCredits');
    const totalCoursesEl = document.getElementById('totalCourses');
    const totalPointsEl = document.getElementById('totalPoints');

    if (gpaDisplay) gpaDisplay.textContent = gpa;
    if (gpaFill) gpaFill.style.width = gpaPercentage + '%';
    if (totalCreditsEl) totalCreditsEl.textContent = totalCredits.toFixed(1);
    if (totalCoursesEl) totalCoursesEl.textContent = validCourses;
    if (totalPointsEl) totalPointsEl.textContent = totalPoints.toFixed(2);

    // Update message based on GPA
    const gpaMessage = document.getElementById('gpaMessage');
    if (gpaMessage) {
        let message = '';
        let color = '';
        const gpaVal = parseFloat(gpa);

        if (gpaVal >= 3.5) {
            message = 'Excellent! Keep up the great work!';
            color = '#2ecc71';
        } else if (gpaVal >= 3.0) {
            message = 'Great job! You are doing well.';
            color = '#4a90e2';
        } else if (gpaVal >= 2.0) {
            message = 'Good effort. There is room for improvement.';
            color = '#f39c12';
        } else if (validCourses > 0) {
            message = 'Focus more on your studies to improve your GPA.';
            color = '#e74c3c';
        }
        
        gpaMessage.textContent = message;
        gpaMessage.style.color = color;
    }

    // Add animation effect
    if (gpaDisplay) {
        gpaDisplay.style.transform = 'scale(1.1)';
        setTimeout(() => {
            gpaDisplay.style.transform = 'scale(1)';
        }, 300);
    }
}

/**
 * Reset calculator
 */
function resetCalculator() {
    const courseInputs = document.getElementById('courseInputs');
    courseInputs.innerHTML = `
        <div class="course-row">
            <div class="input-group">
                <label>Course Name</label>
                <input type="text" placeholder="e.g., Computer Science 101" class="course-name">
            </div>
            <div class="input-group">
                <label>Credits</label>
                <input type="number" min="0" max="6" step="0.5" placeholder="3" class="course-credits">
            </div>
            <div class="input-group">
                <label>Grade</label>
                <select class="course-grade">
                    <option value="">Select Grade</option>
                    <option value="4.0">A (4.0)</option>
                    <option value="3.7">A- (3.7)</option>
                    <option value="3.3">B+ (3.3)</option>
                    <option value="3.0">B (3.0)</option>
                    <option value="2.7">B- (2.7)</option>
                    <option value="2.3">C+ (2.3)</option>
                    <option value="2.0">C (2.0)</option>
                    <option value="1.7">C- (1.7)</option>
                    <option value="1.3">D+ (1.3)</option>
                    <option value="1.0">D (1.0)</option>
                    <option value="0.0">F (0.0)</option>
                </select>
            </div>
            <button class="remove-course" onclick="removeCourse(this)">×</button>
        </div>
    `;

    courseCounter = 1;

    // Reset results
    if (document.getElementById('gpaDisplay')) document.getElementById('gpaDisplay').textContent = '--';
    if (document.getElementById('gpaFill')) document.getElementById('gpaFill').style.width = '0%';
    if (document.getElementById('totalCredits')) document.getElementById('totalCredits').textContent = '0';
    if (document.getElementById('totalCourses')) document.getElementById('totalCourses').textContent = '0';
    if (document.getElementById('totalPoints')) document.getElementById('totalPoints').textContent = '0.00';
    if (document.getElementById('gpaMessage')) document.getElementById('gpaMessage').textContent = '';
}

// Fullscreen Toggle
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// Auto-calculate on input changes
document.addEventListener('input', (e) => {
    if (e.target.classList.contains('course-credits') || e.target.classList.contains('course-grade')) {
        calculateGPA();
    }
});
