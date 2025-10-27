const ctx = document.getElementById('ar').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar', // 'line', 'pie', 'doughnut', etc.
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green'], // X-axis labels
        datasets: [{
            label: '# of Votes',
            data: [5, 2, 3, 5], // Y-axis data
            backgroundColor: [
                'red', 'blue', 'yellow', 'green'
            ],
            borderColor: [
                'darkred', 'darkblue', 'goldenrod', 'darkgreen'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,

        scales: {
            y: {
                beginAtZero: true 
            }
        }
    }
});


myChart.update();
