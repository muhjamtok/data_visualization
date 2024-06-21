let school_districts = []; // Define labels outside to extend its scope
let values = []; // Define labels outside to extend its scope
let countys = [];
let county_codes = [];
let selection = 1;

let county_data = [];
let district_data = [];


function handleDropdownChange(selectedValue) {
    selection = selectedValue; // Assign selectedValue to global selection variable
    //console.log('Selected option:', selection);
}

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

    function load_csv_and_parse(){
        // Load and parse the CSV file
        fetch('District.csv')
        .then(response => response.text())
        .then(data => {
            district_data = Papa.parse(data, {
                header: true,
                complete: function(results) {
                    //console.log('Parsed Data:', results.data);  // Add this line
                    if (results.data && results.data.length > 0) {
                        createChart(results.data);
                        } else {
                            console.error('Parsed data is empty or invalid');
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching CSV data:', error));
    }
    load_csv_and_parse();
    
    // Load and parse the CSV file
    fetch('County.csv')
        .then(response => response.text())
        .then(data => {
            Papa.parse(data, {
                header: true,
                complete: function(results) {
                    //console.log('Parsed County Data:', results.data);  // Add this line
                    if (results.data && results.data.length > 0) {
                        selectCounty(results.data)
                        } else {
                            console.error('Parsed data is empty or invalid');
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching CSV data:', error));
    
    function populateDropdown() {
        const dropdown = document.getElementById('dropdown');

        // Clear existing options (if any)
        dropdown.innerHTML = '';

        // Populate dropdown with options from optionsArray
        county_codes.forEach(option => {
            const optionElement = document.createElement('option');
            //optionElement.value = option.toLowerCase().replace(/\s/g, ''); // Set value to lowercase without spaces
            optionElement.textContent = option; // Set text content to option value
            dropdown.appendChild(optionElement);
        });
    }

    function selectCounty(data){
        if (!data || data.length === 0) {
            console.error('No data provided to createChart');
            return;
        }

        countys = data.map(d => d.Name);
        county_codes = data.map(d => parseFloat(d.CO));
        //console.log('county info1:', countys);  // Log filtered labels
        //console.log('county info2:', county_codes);  // Log filtered values
        populateDropdown();
    
    }

    // Handle dropdown change event
    const dropdown = document.getElementById('dropdown');
    dropdown.addEventListener('change', function() {
        let selection = dropdown.value;
        console.log(district_data);
        createChart(district_data);
    });

    function createChart(data) {
        if (!data || data.length === 0) {
            console.error('No data provided to createChart');
            return;
        }
        // Define the condition for filtering
        const condition = (entry) => parseFloat(entry.CO) === selection;

        // Filter the data based on the condition
        const filteredData = data.filter(condition);

        if (filteredData.length === 0) {
            console.error('No data entries meet the specified condition.');
            return;
        }

        // Validate that all entries in filteredData have the 'Month' property
        const school_districts = filteredData.map((d, index) => {
            if (!d.Name) {
                console.error(`Entry at index ${index} is missing the 'Name' property:`, d);
                return '';
            }
            return d.Name;
        });

        // Ensure there are no empty labels
        if (school_districts.some(school_district => school_district === '')) {
            console.error('One or more entries are missing the "Name" property.');
            return;
        }

        const values = filteredData.map(d => {
            const value = parseFloat(d.Value);
            if (isNaN(value)) {
                console.error(`Invalid number found in data: ${d.Value}`);
                return 0;
            }
            return value;
        });

        // Log labels and values arrays to ensure they're correct
        //console.log('Filtered Labels:', school_districts);  // Log filtered labels
        //console.log('Filtered Values:', values);  // Log filtered values
        //return school_districts;
        //return values;

        // Create a chart
            const chart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: school_districts,
                    datasets: [{
                        label: 'Yearly Expenses',
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
            chart.update();
        }
});
