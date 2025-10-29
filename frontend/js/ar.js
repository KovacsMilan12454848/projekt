const ctx = document.getElementById('ar').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar', 
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green'], 
        datasets: [{
            label: '# of Votes',
            data: [5, 2, 3, 5], 
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

chart.update();
