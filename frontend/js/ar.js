const ctx = document.getElementById('ar').getContext('2d');
const chart = new Chart(ctx, {
    type: 'bar', 
    data: {
        labels: ['L-Theanine (100 mg, 60 kapszula)', 'Glicin (500g por)','N-Acetylcysteine (NAC) (750 mg, 120 kapszula)'], 
        datasets: [{
            label: '# of Votes',
            data: [22.44, 14.99, 21.49, ], 
            backgroundColor: [
                'red', 'green', 'yellow'
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
        },
        plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            return '€' + context.parsed.y; // show only the value in euros
          }
        }
      }
    }
    }
});

chart.update();
