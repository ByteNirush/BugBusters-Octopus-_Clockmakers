// Initialize journal entries from localStorage
let journalEntries = [];
try {
    journalEntries = JSON.parse(localStorage.getItem('journalEntries')) || [];
} catch (error) {
    console.error('Error parsing journal entries from localStorage:', error);
}

// Set today's date as default
document.getElementById('entry-date').valueAsDate = new Date();

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
let activeTextarea = null;

// Start voice input
document.querySelectorAll('.voice-button').forEach(button => {
    button.addEventListener('click', function () {
        activeTextarea = this.previousElementSibling;
        recognition.start();
        this.classList.add('recording');
    });
});

// Process speech recognition results
recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    if (activeTextarea) {
        activeTextarea.value += (activeTextarea.value ? ' ' : '') + transcript;
    }
};

// Handle recognition end
recognition.onend = function () {
    document.querySelectorAll('.recording').forEach(btn => btn.classList.remove('recording'));
};

// Handle recognition errors
recognition.onerror = function (event) {
    console.error('Speech Recognition Error:', event.error);
    alert('Voice recognition error: ' + event.error);
};

// Save or update journal entry
document.getElementById('save-entry').addEventListener('click', () => {
    const date = document.getElementById('entry-date').value;
    const mood = document.getElementById('entry-mood').value;
    const prompts = Array.from(document.querySelectorAll('.prompt-textarea'))
        .map(textarea => ({
            prompt: textarea.previousElementSibling.textContent,
            response: textarea.value.trim()
        }))
        .filter(entry => entry.response !== '');
    const tags = document.getElementById('entry-tags').value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag);
    const entryId = document.getElementById('save-entry').dataset.editingId;

    if (!date || prompts.length === 0) {
        alert('Please enter a date and at least one journal entry.');
        return;
    }

    if (entryId) {
        // Update existing entry
        journalEntries = journalEntries.map(entry =>
            entry.id === Number(entryId) ? { ...entry, date, mood, prompts, tags } : entry
        );
        delete document.getElementById('save-entry').dataset.editingId;
        alert('Journal entry updated successfully!');
    } else {
        // Create new entry
        const newEntry = {
            id: Date.now(),
            date,
            mood,
            prompts,
            tags,
            timestamp: new Date().toISOString()
        };
        journalEntries.unshift(newEntry);
        alert('Journal entry saved successfully!');
    }

    try {
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    } catch (error) {
        console.error('Error saving journal entries to localStorage:', error);
    }
    clearForm();
    displayEntries();
});

// Clear form inputs
function clearForm() {
    document.querySelectorAll('.prompt-textarea').forEach(textarea => (textarea.value = ''));
    document.getElementById('entry-tags').value = '';
    document.getElementById('save-entry').textContent = 'Save Journal Entry';
}

// Delete journal entry
function deleteEntry(entryId) {
    console.log("Attempting to delete entry with ID:", entryId); // Debugging log
    journalEntries = journalEntries.filter(entry => entry.id !== entryId);
    try {
        localStorage.setItem('journalEntries', JSON.stringify(journalEntries));
    } catch (error) {
        console.error('Error saving journal entries to localStorage:', error);
    }
    document.querySelector(`.entry-card[data-id="${entryId}"]`).remove(); // Remove entry from DOM
}

// Edit journal entry
function editEntry(entryId) {
    const entry = journalEntries.find(entry => entry.id === entryId);
    if (!entry) return;

    document.getElementById('entry-date').value = entry.date;
    document.getElementById('entry-mood').value = entry.mood;
    document.querySelectorAll('.prompt-textarea').forEach((textarea, index) => {
        textarea.value = entry.prompts[index] ? entry.prompts[index].response : '';
        if (!entry.prompts[index]) {
            textarea.value = '';
        }
    });
    document.getElementById('entry-tags').value = entry.tags.join(', ');

    document.getElementById('save-entry').textContent = 'Update Entry';
    document.getElementById('save-entry').dataset.editingId = entry.id;
}

// Search and filter entries
document.getElementById('search-entries').addEventListener('input', displayEntries);
document.getElementById('mood-filter').addEventListener('change', displayEntries);

function displayEntries() {
    const searchTerm = document.getElementById('search-entries').value.toLowerCase();
    const moodFilter = document.getElementById('mood-filter').value;
    const pastEntriesSection = document.querySelector('.past-entries');

    if (!journalEntries.length) {
        pastEntriesSection.innerHTML = '<p>No journal entries yet.</p>';
        return;
    }

    const filteredEntries = journalEntries.filter(entry => {
        const matchesMood = !moodFilter || entry.mood === moodFilter;
        const matchesSearch =
            !searchTerm ||
            entry.prompts.some(p => p.response.toLowerCase().includes(searchTerm)) ||
            entry.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        return matchesMood && matchesSearch;
    });

    renderEntries(filteredEntries);
}

function renderEntries(entries) {
    const pastEntriesSection = document.querySelector('.past-entries');
    pastEntriesSection.innerHTML = '<h2>Past Entries</h2><div id="entries-list"></div>';
    const entriesList = document.getElementById('entries-list');
    entriesList.innerHTML = entries
        .map(entry => `
        <div class="entry-card" data-id="${entry.id}">
            <div class="entry-header">
                <span class="entry-date">${new Date(entry.date).toLocaleDateString()}</span>
                <span class="entry-mood">${getMoodEmoji(entry.mood)}</span>
            </div>
            <div class="entry-content">
                ${entry.prompts.map(p => `
                    <div class="entry-prompt">
                        <strong>${p.prompt}</strong>
                        <p>${p.response}</p>
                    </div>
                `).join('')}
            </div>
            ${entry.tags && entry.tags.length ? `
                <div class="entry-tags">
                    ${entry.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            ` : ''}
            <div class="entry-actions">
                <button class="edit-button" data-id="${entry.id}">Edit</button>
                <button class="delete-button" data-id="${entry.id}">Delete</button>
            </div>
        </div>
    `).join('');

    // Attach delete event listeners
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function () {
            const entryId = Number(this.dataset.id);
            console.log("Delete button clicked for ID:", entryId); // Debugging log
            deleteEntry(entryId);
        });
    });

    // Attach edit event listeners
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const entryId = Number(this.dataset.id);
            editEntry(entryId);
        });
    });
}

function getMoodEmoji(mood) {
    const moods = {
        great: '😊',
        good: '🙂',
        okay: '😐',
        down: '😕',
        bad: '😢'
    };
    return moods[mood] || '😐';
}

// Initial display
displayEntries();
