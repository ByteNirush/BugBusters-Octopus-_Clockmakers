document.getElementById('goalForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const category = document.getElementById('category').value;
    const goal = document.getElementById('goal').value;
    const deadline = document.getElementById('deadline').value;
    const priority = document.getElementById('priority').value;

    addGoalToTable(category, goal, deadline, priority);

    // Clear the input fields
    document.getElementById('goalForm').reset();
});

function addGoalToTable(category, goal, deadline, priority) {
    const goalTableBody = document.getElementById('goalTableBody');
    const goalRow = document.createElement('tr');

    // Color coding based on priority for the row
    let rowColor;
    switch (priority) {
        case 'High':
            rowColor = '#ffcccc'; // Light Red
            break;
        case 'Medium':
            rowColor = '#ffffcc'; // Light Yellow
            break;
        case 'Low':
            rowColor = '#ccffcc'; // Light Green
            break;
    }
    goalRow.style.backgroundColor = rowColor;

    // Format the deadline correctly
    const formattedDate = new Date(deadline).toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    goalRow.innerHTML = `
        <td>${category}</td>
        <td>${goal}</td>
        <td>${formattedDate}</td>
        <td>${priority}</td>
        <td><button class="action-btn" onclick="deleteGoal(this)">Delete</button></td>
    `;

    goalTableBody.appendChild(goalRow);
}

function deleteGoal(button) {
    const row = button.parentElement.parentElement;
    row.remove();
}
