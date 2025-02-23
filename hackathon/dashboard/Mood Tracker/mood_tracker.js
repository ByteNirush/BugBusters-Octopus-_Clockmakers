// // Store mood data for graph
// let moodData = [];
// let moodLabels = [];

// // Chart.js Initialization
// const ctx = document.getElementById("moodChart").getContext("2d");
// const moodChart = new Chart(ctx, {
//     type: "line",
//     data: {
//         labels: moodLabels,
//         datasets: [{
//             label: "Average Mood Score",
//             data: moodData,
//             borderColor: "#6200ea",
//             backgroundColor: "rgba(98, 0, 234, 0.2)",
//             borderWidth: 2,
//             fill: true
//         }]
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 max: 10
//             }
//         }
//     }
// });

// // Function to update the displayed value of sliders
// function updateValue(slider) {
//     slider.nextElementSibling.textContent = slider.value;
// }

// // Save Mood Function
// function saveMood() {
//     const sliders = document.querySelectorAll(".slider");
    
//     // Calculate the average mood score
//     let total = 0;
//     sliders.forEach(slider => total += parseInt(slider.value));
//     let avgMood = total / sliders.length;

//     // Add to history
//     let date = new Date().toLocaleDateString();
    
//     if (!moodLabels.includes(date)) {
//         moodLabels.push(date);
//         moodData.push(avgMood);
//     } else {
//         // Update today's mood if already exists
//         let index = moodLabels.indexOf(date);
//         moodData[index] = avgMood;
//     }

//     // Update graph
//     moodChart.update();
// }



document.addEventListener('DOMContentLoaded', function () {
    const sliders = document.querySelectorAll('.mood-slider');
    const saveBtn = document.getElementById('saveBtn');
    const currentDate = document.getElementById('currentDate');
    let moodChart;

    // Set current date
    currentDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    // Initialize mood data
    let moodData = JSON.parse(localStorage.getItem('moodData')) || {
        happiness: Array(7).fill(50),
        energy: Array(7).fill(50),
        creativity: Array(7).fill(50),
        focus: Array(7).fill(50)
    };

    // Update slider progress and percentage
    function updateSlider(slider) {
        const value = slider.value;
        const type = slider.dataset.type;
        const progress = slider.parentElement.querySelector('.slider-progress');
        const percentage = slider.parentElement.parentElement.querySelector('.percentage');
        const statValue = document.getElementById(`${type}Value`);
        
        progress.style.width = value + '%';
        percentage.textContent = value + '%';
        if (statValue) statValue.textContent = value + '%';
    }

    // Initialize and update chart
    function initChart() {
        const ctx = document.getElementById('moodChart').getContext('2d');
        const gradientFill = ctx.createLinearGradient(0, 0, 0, 400);
        gradientFill.addColorStop(0, 'rgba(124, 58, 237, 0.2)');
        gradientFill.addColorStop(1, 'rgba(124, 58, 237, 0)');

        moodChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: getLast7Days(),
                datasets: [
                    {
                        label: 'Happiness',
                        data: moodData.happiness,
                        borderColor: '#7c3aed',
                        backgroundColor: gradientFill,
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: 'Energy',
                        data: moodData.energy,
                        borderColor: '#10b981',
                        tension: 0.4
                    },
                    {
                        label: 'Creativity',
                        data: moodData.creativity,
                        borderColor: '#f59e0b',
                        tension: 0.4
                    },
                    {
                        label: 'Focus',
                        data: moodData.focus,
                        borderColor: '#3b82f6',
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Get last 7 days for chart labels
    function getLast7Days() {
        return Array(7).fill().map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
    }

    // Update chart data
    function updateChart() {
        moodData.happiness.push(parseInt(document.querySelector('[data-type="happiness"]').value));
        moodData.energy.push(parseInt(document.querySelector('[data-type="energy"]').value));
        moodData.creativity.push(parseInt(document.querySelector('[data-type="creativity"]').value));
        moodData.focus.push(parseInt(document.querySelector('[data-type="focus"]').value));

        // Keep only last 7 days
        Object.keys(moodData).forEach(key => {
            moodData[key] = moodData[key].slice(-7);
        });

        moodChart.data.datasets[0].data = moodData.happiness;
        moodChart.data.datasets[1].data = moodData.energy;
        moodChart.data.datasets[2].data = moodData.creativity;
        moodChart.data.datasets[3].data = moodData.focus;
        moodChart.update();

        // Save to localStorage
        localStorage.setItem('moodData', JSON.stringify(moodData));
    }

    // Event listeners
    sliders.forEach(slider => {
        updateSlider(slider); // Initialize sliders
        slider.addEventListener('input', () => updateSlider(slider));
    });

    saveBtn.addEventListener('click', function () {
        updateChart();
        this.classList.add('saved');
        this.textContent = 'Saved!';
        setTimeout(() => {
            this.classList.remove('saved');
            this.textContent = 'Save Mood';
        }, 2000);
    });

    // Initialize chart
    initChart();
});

