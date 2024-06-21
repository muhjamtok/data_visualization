document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('chart');
    if (!canvas) {
        console.error('Canvas element with id "chart" not found');
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('getContext returned null');
        return;
    }

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
