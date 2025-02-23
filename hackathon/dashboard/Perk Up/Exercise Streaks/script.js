function increaseLevel(exercise) {
    const levelSpan = document.querySelector(`#${exercise} .level`);
    let currentLevel = parseInt(levelSpan.textContent);
    currentLevel++;
    levelSpan.textContent = currentLevel;
    localStorage.setItem(exercise, currentLevel); // Save level to local storage
}

function startTimer(exercise) {
    const inputField = document.getElementById(`${exercise}-time`);
    const timeInMinutes = parseInt(inputField.value);
    
    if (isNaN(timeInMinutes) || timeInMinutes <= 0) {
        alert('Please enter a valid time in minutes.');
        return;
    }

    const progressBar = document.getElementById(`${exercise}-progress`);
    const timeInMilliseconds = timeInMinutes * 60 * 1000; // Convert minutes to milliseconds

    // Reset the progress bar
    progressBar.style.width = '0%';

    const interval = setInterval(() => {
        let width = parseFloat(progressBar.style.width);
        width += (100 / (timeInMilliseconds / 100)); // Update progress
        progressBar.style.width = Math.min(width, 100) + '%'; // Limit to 100%

        if (width >= 100) {
            clearInterval(interval);
        }
    }, 100);

    setTimeout(() => {
        increaseLevel(exercise);
        alert(`${exercise.charAt(0).toUpperCase() + exercise.slice(1)} level increased!`);
        progressBar.style.width = '100%'; // Set to full when complete
    }, timeInMilliseconds);

    inputField.value = ''; // Clear the input field after starting the timer
}

function resetLevel(exercise) {
    const levelSpan = document.querySelector(`#${exercise} .level`);
    levelSpan.textContent = '0';
    localStorage.setItem(exercise, 0); // Reset level in local storage
    document.getElementById(`${exercise}-progress`).style.width = '0%'; // Reset progress bar
}

// Load levels from local storage on page load
document.addEventListener("DOMContentLoaded", () => {
    const exercises = ['pushups', 'squats', 'situps', 'highknees', 'plank', 'pullups'];
    exercises.forEach(exercise => {
        const storedLevel = localStorage.getItem(exercise);
        if (storedLevel) {
            document.querySelector(`#${exercise} .level`).textContent = storedLevel;
        }
    });
});
