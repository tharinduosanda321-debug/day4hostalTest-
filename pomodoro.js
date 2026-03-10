// Pomodoro Timer JavaScript
class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.longBreakTime = 15 * 60; // 15 minutes in seconds
        this.sessionsBeforeLongBreak = 4;
        this.currentTime = this.workTime;
        this.isRunning = false;
        this.isWorkSession = true;
        this.currentSession = 1;
        this.completedSessions = 0;
        this.interval = null;

        // DOM elements
        this.timeDisplay = document.getElementById('time-display');
        this.sessionType = document.getElementById('session-type');
        this.startBtn = document.getElementById('start-btn');
        this.pauseBtn = document.getElementById('pause-btn');
        this.resetBtn = document.getElementById('reset-btn');
        this.progressRing = document.querySelector('.timer-progress');
        this.workTimeInput = document.getElementById('work-time');
        this.breakTimeInput = document.getElementById('break-time');
        this.longBreakTimeInput = document.getElementById('long-break-time');
        this.sessionsInput = document.getElementById('sessions-before-long');
        this.completedSessionsEl = document.getElementById('completed-sessions');
        this.totalSessionsEl = document.getElementById('total-sessions');
        this.totalTimeEl = document.getElementById('total-time');
        this.historyList = document.getElementById('history-list');

        this.initializeEventListeners();
        this.loadSettings();
        this.updateDisplay();
        this.updateStats();
        this.loadHistory();
    }

    initializeEventListeners() {
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());

        // Settings inputs
        this.workTimeInput.addEventListener('change', () => this.updateSettings());
        this.breakTimeInput.addEventListener('change', () => this.updateSettings());
        this.longBreakTimeInput.addEventListener('change', () => this.updateSettings());
        this.sessionsInput.addEventListener('change', () => this.updateSettings());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                if (this.isRunning) {
                    this.pause();
                } else {
                    this.start();
                }
            } else if (e.code === 'KeyR') {
                this.reset();
            }
        });
    }

    updateSettings() {
        this.workTime = parseInt(this.workTimeInput.value) * 60;
        this.breakTime = parseInt(this.breakTimeInput.value) * 60;
        this.longBreakTime = parseInt(this.longBreakTimeInput.value) * 60;
        this.sessionsBeforeLongBreak = parseInt(this.sessionsInput.value);

        this.saveSettings();
        if (!this.isRunning) {
            this.reset();
        }
    }

    loadSettings() {
        const settings = JSON.parse(localStorage.getItem('pomodoro-settings') || '{}');
        this.workTime = (settings.workTime || 25) * 60;
        this.breakTime = (settings.breakTime || 5) * 60;
        this.longBreakTime = (settings.longBreakTime || 15) * 60;
        this.sessionsBeforeLongBreak = settings.sessionsBeforeLongBreak || 4;

        this.workTimeInput.value = this.workTime / 60;
        this.breakTimeInput.value = this.breakTime / 60;
        this.longBreakTimeInput.value = this.longBreakTime / 60;
        this.sessionsInput.value = this.sessionsBeforeLongBreak;
    }

    saveSettings() {
        const settings = {
            workTime: this.workTime / 60,
            breakTime: this.breakTime / 60,
            longBreakTime: this.longBreakTime / 60,
            sessionsBeforeLongBreak: this.sessionsBeforeLongBreak
        };
        localStorage.setItem('pomodoro-settings', JSON.stringify(settings));
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            this.interval = setInterval(() => this.tick(), 1000);
        }
    }

    pause() {
        if (this.isRunning) {
            this.isRunning = false;
            this.startBtn.disabled = false;
            this.pauseBtn.disabled = true;
            clearInterval(this.interval);
        }
    }

    reset() {
        this.pause();
        this.isWorkSession = true;
        this.currentSession = 1;
        this.currentTime = this.workTime;
        this.updateDisplay();
        this.updateProgress();
    }

    tick() {
        this.currentTime--;

        if (this.currentTime <= 0) {
            this.sessionComplete();
        }

        this.updateDisplay();
        this.updateProgress();
    }

    sessionComplete() {
        this.pause();

        // Play notification sound (if supported)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(this.isWorkSession ? 'Work session complete!' : 'Break time over!', {
                body: this.isWorkSession ? 'Time for a break!' : 'Back to work!',
                icon: '/favicon.ico'
            });
        }

        // Add to history
        this.addToHistory();

        if (this.isWorkSession) {
            this.completedSessions++;
            this.saveStats();

            // Determine next break type
            if (this.currentSession % this.sessionsBeforeLongBreak === 0) {
                this.currentTime = this.longBreakTime;
                this.sessionType.textContent = 'Long Break';
            } else {
                this.currentTime = this.breakTime;
                this.sessionType.textContent = 'Short Break';
            }
            this.isWorkSession = false;
        } else {
            this.currentSession++;
            this.currentTime = this.workTime;
            this.sessionType.textContent = 'Work Session';
            this.isWorkSession = true;
        }

        this.updateStats();
        this.updateDisplay();
        this.updateProgress();
    }

    updateDisplay() {
        const minutes = Math.floor(this.currentTime / 60);
        const seconds = this.currentTime % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        if (this.isWorkSession) {
            this.sessionType.textContent = `Work Session ${this.currentSession}`;
        }
    }

    updateProgress() {
        const totalTime = this.isWorkSession ? this.workTime : (this.currentSession % this.sessionsBeforeLongBreak === 0 ? this.longBreakTime : this.breakTime);
        const progress = ((totalTime - this.currentTime) / totalTime) * 360;
        this.progressRing.style.background = `conic-gradient(
            rgba(255, 255, 255, 0.2) ${progress}deg,
            rgba(255, 255, 255, 0.2) ${progress}deg,
            transparent ${progress}deg
        )`;
    }

    updateStats() {
        this.completedSessionsEl.textContent = this.completedSessions;
        this.totalSessionsEl.textContent = this.currentSession - 1;

        // Calculate total time (simplified - in a real app you'd track this more accurately)
        const totalMinutes = Math.floor((this.completedSessions * this.workTime + (this.currentSession - 1 - this.completedSessions) * (this.breakTime + this.longBreakTime)) / 60);
        this.totalTimeEl.textContent = `${totalMinutes}m`;
    }

    saveStats() {
        const stats = {
            completedSessions: this.completedSessions,
            totalSessions: this.currentSession - 1,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('pomodoro-stats', JSON.stringify(stats));
    }

    loadStats() {
        const stats = JSON.parse(localStorage.getItem('pomodoro-stats') || '{}');
        this.completedSessions = stats.completedSessions || 0;
    }

    addToHistory() {
        const history = JSON.parse(localStorage.getItem('pomodoro-history') || '[]');
        const session = {
            type: this.isWorkSession ? 'work' : (this.currentSession % this.sessionsBeforeLongBreak === 0 ? 'long-break' : 'short-break'),
            sessionNumber: this.currentSession,
            completedAt: new Date().toISOString(),
            duration: this.isWorkSession ? this.workTime : (this.currentSession % this.sessionsBeforeLongBreak === 0 ? this.longBreakTime : this.breakTime)
        };

        history.unshift(session);
        // Keep only last 50 sessions
        if (history.length > 50) {
            history.splice(50);
        }

        localStorage.setItem('pomodoro-history', JSON.stringify(history));
        this.loadHistory();
    }

    loadHistory() {
        const history = JSON.parse(localStorage.getItem('pomodoro-history') || '[]');

        if (history.length === 0) {
            this.historyList.innerHTML = '<div class="history-item empty">No sessions completed yet</div>';
            return;
        }

        this.historyList.innerHTML = history.slice(0, 10).map(session => {
            const date = new Date(session.completedAt);
            const timeString = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const icon = session.type === 'work' ? '💼' : session.type === 'long-break' ? '🌴' : '☕';
            const typeText = session.type === 'work' ? 'Work' : session.type === 'long-break' ? 'Long Break' : 'Short Break';

            return `
                <div class="history-item">
                    <div class="session-info">
                        <span class="session-icon">${icon}</span>
                        <div>
                            <div>${typeText} Session ${session.sessionNumber}</div>
                            <div class="session-details">${Math.floor(session.duration / 60)} minutes</div>
                        </div>
                    </div>
                    <div class="session-time">${timeString}</div>
                </div>
            `;
        }).join('');
    }
}

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
});