document.addEventListener('DOMContentLoaded', function() {
    // Simulated database data
    const data = [
        { label: 'January', value: 30 },
        { label: 'February', value: 20 },
        { label: 'March', value: 50 },
        { label: 'April', value: 40 },
        { label: 'May', value: 70 },
        { label: 'June', value: 60 },
    ];

    // Extract labels and values
    const labels = data.map(d => d.label);
    const values = data.map(d => d.value);

    // Create a chart
    const ctx = document.getElementById('chart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Monthly Data',
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});
