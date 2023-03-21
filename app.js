
// Creates an overarching JSON object containing all registered employees and their information
let empdata = JSON.parse(localStorage.getItem("employees"));
var employeesJSON  = {};
if (JSON.parse(localStorage.getItem("employees"))) {
    employeesJSON = JSON.parse(localStorage.getItem("employees"));
    popdropnew();
    popdrop();
}

// Code for 'Add Employee' section
function addEmployee() {
    document.getElementById('qrCode').innerHTML = '';
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const positionInput = document.getElementById("positionInput");
    const salaryInput = document.getElementById("salaryInput");

    // Retrieves the values from the section's form fields
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const position = positionInput.value;
    const salary = parseFloat(salaryInput.value);

    // Adds data from site inputs to employee's JSON object
    const employeeKey = `${firstName}_${lastName}`;
    const employeeData = {
        fullName: '',
        firstName: firstName,
        lastName: lastName,
        position: position,
        salary: salary,
        scanTimes: []
    };

    // Adds employee's JSON object to the overarching JSON object
    employeesJSON[employeeKey] = employeeData;

    popdrop();
    popdropnew();

    // Creates and displays the QR Code
    var typeNumber = 4;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    const data = `http://bread-7.github.io/?employee=${firstName}_${lastName}`;
    qr.addData(data);
    qr.make();
    document.getElementById('qrCode').innerHTML = qr.createImgTag();

    // Clears the section's form fields
    firstNameInput.value = "";
    lastNameInput.value = "";
    positionInput.value = "";
    salaryInput.value = "";

    // Adds the updated overarching JSON object to the local storage
    localStorage.setItem('employees', JSON.stringify(employeesJSON));
    var emp = JSON.parse(localStorage.getItem("employees"));
}

// Code for 'View Employee' section
function viewEmployeeData() {

    const selectEmployeeDropdown = document.getElementById('employeeNameSelect');
    
    // Retrieves the values from the section's form fields
    const beginDate = new Date(document.getElementById('startDateInput').value); // Start of range
    const endDate = new Date(document.getElementById('endDateInput').value); // End of range
    const selectedEmployee = selectEmployeeDropdown.value;
    const employeeKey = selectedEmployee.replace(/\s+/g, '_');
    const employee = employeesJSON[employeeKey];
    const payRate = employee.salary;
    const employeeData = document.getElementById('qrCodeModal');
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    const workedHours = [];

    if (beginDate > endDate) {
        employeeData.innerHTML = '<p>Invalid date range</p>';
        return;
    }

    if (!employee) {
        employeeData.innerHTML = '<p>No employee data found</p>';
        return;
    }

    // Compiles the employee's scan times into a list
    let scanDates = [];
    for (const scanKey in employee) {
        if (scanKey.includes('scan_')) {
            const scanDate = new Date(employee[scanKey]);
            if (scanDate >= beginDate && scanDate <= endDate) {
                scanDates.push(scanDate);
            }
        }
    }

    // Calculates the deserved pay based on the hours worked in the specified range
    let totalHours = 0;
    for (let i = 0; i < scanDates.length; i += 2) {
        const timeDiff = scanDates[i + 1] - scanDates[i];
        const hoursWorked = timeDiff / (1000 * 60 * 60);
        workedHours.push(hoursWorked);
        totalHours += hoursWorked;
    }

    const payAmount = totalHours * payRate;

    // Outputs the data to the website
    let html = '';
    html += `<p>Name: ${employeeName}</p>`;
    html += `<p>Position: ${employee.position}</p>`;
    html += `<p>Hourly Salary: ${payRate.toFixed(2)}</p>`;
    html += '<p>Scan Dates:</p>';
    html += '<ul>';    
    scanDates.forEach(scanDate => {
        html += `<li>${scanDate.toLocaleString()}</li>`;
    });
    html += '</ul>';
    html += '<p>Worked Hours:</p>';
    html += '<ul>';
    workedHours.forEach(hoursWorked => {
        html += `<li>${hoursWorked.toFixed(2)} hours</li>`;
    });
    html += '</ul>';
    html += `<p>Total Pay: $${payAmount.toFixed(2)}</p>`;

    employeeData.innerHTML = html;
    var typeNumber = 4;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    const data = `http://bread-7.github.io/?employee=${employee.firstName}_${employee.lastName}`;
    qr.addData(data);
    qr.make();
    employeeData.innerHTML += qr.createImgTag();
}

// Code for 'Remove Employee' section
function removeEmployee() {
    const employeeSelect = document.getElementById("removeEmployeeSelect");
    const selectEmployeeDropdown = document.getElementById('employeeNameSelect');

    // Wipes the employee and their data from the overarching JSON object
    const employeeKey = employeeSelect.value;
    delete employeesJSON[employeeKey];

    employeeSelect.remove(employeeSelect.selectedIndex);
    console.log(employeesJSON);
    popdrop();
    popdropnew();

}

// Code for populating dropdown in 'View Employee' section
function popdrop() {
    const selectEmployeeDropdown = document.getElementById('employeeNameSelect');
    selectEmployeeDropdown.innerHTML = '';

    for (const employeeKey in employeesJSON) {
        const [firstName, lastName] = employeeKey.split('_');
        const selectOption = document.createElement('option');
        selectOption.value = employeeKey;
        selectOption.fullName = `${firstName} ${lastName}`;
        selectEmployeeDropdown.appendChild(selectOption);
    }
}

// Code for populating dropdown in 'Remove Employee' section
function popdropnew() {
    const selectEmployeeDropdown = document.getElementById('removeEmployeeSelect');
    selectEmployeeDropdown.innerHTML = '';

    for (const employeeKey in employeesJSON) {
        const [firstName, lastName] = employeeKey.split('_');
        const selectOption = document.createElement('option');
        selectOption.value = employeeKey;
        selectOption.fullName = `${firstName} ${lastName}`;
        selectEmployeeDropdown.appendChild(selectOption);
    }
}

// Code executed when QR Code is scanned
function scancount() {
    var empKey = findGetParameter('employee');
    if(empKey){
        var emp = employeesJSON[empKey];
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        todate = mm + '/' + dd + '/' + yyyy;
        var new_date = 'scan_' + generateRandom(1, 1000, 50);
        emp[new_date] = today;
        console.log(employeesJSON[empKey]);
        localStorage.setItem('employees', JSON.stringify(employeesJSON));
        window.location = `http://bread-7.github.io/?employees=${emp['firstName']}_${emp['lastName']}`;
    }
}

// Checks if the specified employee exists in the database
function findGetParameter(name) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === name) result = decodeURIComponent(tmp[1]);
        });
    return result;
}
function generateRandom(min, max, step) {
    const randomNum = min + Math.random() * (max - min);
    return Math.round(randomNum / step) * step;
}

scancount();
