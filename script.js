let school_districts = []; // Define labels outside to extend its scope
let values = []; // Define labels outside to extend its scope
let countys = [];
let county_codes = [];
let selection = 1;
let flag = 0;

let county_data = [];
let district_data = [];

let chart = "";


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
                    console.log('Parsed Data:', results.data, typeof results.data);  // Add this line
                    if (results.data && results.data.length > 0) {
                        const temp_data = filterData(results.data);
                        createChart(temp_data);
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
                        selectCounty(results.data);
                        populateTable(results.data);
                        } else {
                            console.error('Parsed data is empty or invalid');
                    }
                }
            });
        })
        .catch(error => console.error('Error fetching CSV data:', error));

    // Function to populate HTML table
    function populateTable(data) {
        const tbody = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = ''; // Clear any existing rows

    data.forEach(item => {
        const row = tbody.insertRow();
        const cellLabel = row.insertCell(0);
        const cellValue = row.insertCell(1);
        cellLabel.textContent = item.Name;
        cellValue.textContent = item.CO;
    });

    
}


    
    function populateDropdown() {
        const dropdown = document.getElementById('dropdown');

        // Clear existing options (if any)
        dropdown.innerHTML = '';

        // Populate dropdown with options from optionsArray
        for ( let i = 0; i < countys.length; i++ ) {
            const optionElement = document.createElement('option');
            //optionElement.value = option.toLowerCase().replace(/\s/g, ''); // Set value to lowercase without spaces
            optionElement.value = county_codes[i];
            optionElement.textContent = countys[i]; // Set text content to option value
            dropdown.appendChild(optionElement);
        }
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
        selection = dropdown.value;



        temp = Object.keys(district_data).map(data => district_data[data])[0];
        console.log(temp);

        console.log("dropdown update data", temp, typeof temp);
        filteredData = filterData(temp);


        createChart(filteredData);
    });
    
    // Function to update chart data
    function updateChart(data) {
        createChart(data);


        //chart.update();
    }

    function filterData(data){

        console.log("filterData input: ", data, typeof data);
        console.log("current selection ", selection);
        if (!data || data.length === 0) {
            console.error('No data provided to createChart');
            return;
        }
        // Define the condition for filtering
        const condition = (entry) => parseFloat(parseInt(entry.CO)) === parseInt(selection);

        // Filter the data based on the condition
        const filteredData = data.filter(condition);

        console.log("filterData post filter: ", filteredData, typeof filteredData);
        
        if (filteredData.length === 0) {
            console.error('No data entries meet the specified condition.');
            return;
        }
        if (!data || data.length === 0) {
            console.error('No data provided to createChart');
            return;
        }
        return filteredData;
    }

    function createChart(data) {

        // Validate that all entries in filteredData have the 'Name' property
        const school_districts = data.map((d, index) => {
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

        const values = data.map(d => {
            const value = parseFloat(d.Value);
            if (isNaN(value)) {
                console.error(`Invalid number found in data: ${d.Value}`);
                return 0;
            }
            return value;
        });

        if(flag===0){
            flag++;
        } else{
            chart.destroy();
        }

        // Create a chart
            chart = new Chart(ctx, {
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
        }
});
