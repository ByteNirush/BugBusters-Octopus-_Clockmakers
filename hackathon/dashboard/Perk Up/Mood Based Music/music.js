// Initialize the audio controller
const audioController = {
    ambientSounds: {},
    currentAmbientSound: null,

    loadAmbientSounds() {
        this.ambientSounds = {
            Peaceful: new Audio('Energizing/Beautiful Music Peaceful.mp3'),
            Dreamy_Music_Dreamy: new Audio('Energizing/Dreamy Music Dreamy.mp3'),
            Beautiful_Music_Peaceful: new Audio('Energizing/Beautiful Music Peaceful 1.mp3'),
            Energizing_Groovy: new Audio('Energizing/Energizing Groovy.mp3'),
            Energizing_Pumped: new Audio('Energizing/Energizing Pumped.mp3'),
            Energizing_Upbeat: new Audio('Energizing/Energizing Upbeat.mp3'),
            Energizing_Uplifting: new Audio('Energizing/Energizing Uplifting.mp3'),
            Heroic: new Audio('Energizing/Heroic Filmic.mp3'),
            Sad: new Audio('Energizing/Sad Music Nostalgic.mp3'),
            Heroic_1: new Audio('Energizing/Heroic Filmic 2.mp3'),
        };
    },

    playAmbientSound(soundType) {
        if (!this.ambientSounds[soundType]) {
            console.warn(`Sound "${soundType}" not found.`);
            return;
        }

        if (this.currentAmbientSound && this.currentAmbientSound !== soundType) {
            this.ambientSounds[this.currentAmbientSound].pause();
            this.ambientSounds[this.currentAmbientSound].currentTime = 0;
        }

        this.currentAmbientSound = soundType;
        this.ambientSounds[soundType].play();
    },

    loadGuidedMeditations() {
        // Implement loading guided meditations if needed
    }
};

function initializeAudio() {
    audioController.loadAmbientSounds();
    audioController.loadGuidedMeditations();
    setupSoundButtons();
}

window.addEventListener('load', initializeAudio);

function setupSoundButtons() {
    document.querySelectorAll('.sound-btn').forEach(button => {
        button.addEventListener('click', () => {
            const soundType = button.dataset.sound;
            audioController.playAmbientSound(soundType);
            toggleSoundButtonState(soundType);
        });
    });
}

function toggleSoundButtonState(activeSound) {
    document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.sound === activeSound && audioController.currentAmbientSound === activeSound);
    });
}

// Timer variables
let timer;
let timerDuration = 20 * 60; // 20 minutes in seconds

function startTimer() {
    if (timer) return; // Prevent multiple intervals from stacking

    timer = setInterval(() => {
        if (timerDuration <= 0) {
            clearInterval(timer);
            timer = null; // Reset timer variable
            alert('Time is up!');
        } else {
            timerDuration--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timerDuration / 60);
    const seconds = timerDuration % 60;
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-timer');
    const stopButton = document.getElementById('stop-timer');
    const increaseButton = document.getElementById('increase-time');
    const decreaseButton = document.getElementById('decrease-time');

    if (startButton) startButton.addEventListener('click', startTimer);
    if (stopButton) stopButton.addEventListener('click', () => {
        clearInterval(timer);
        timer = null; // Reset timer variable
        timerDuration = 20 * 60; // Reset to 20 minutes
        updateTimerDisplay();
    });

    if (increaseButton) increaseButton.addEventListener('click', () => {
        timerDuration += 5 * 60; // Increase by 5 minutes
        updateTimerDisplay();
    });

    if (decreaseButton) decreaseButton.addEventListener('click', () => {
        timerDuration = Math.max(0, timerDuration - 5 * 60); // Decrease by 5 minutes, not below 0
        updateTimerDisplay();
    });

    updateTimerDisplay(); // Initialize display
});
