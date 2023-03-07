let employeesJSON = {};

function addEmployee() {
    document.getElementById('qrCode').innerHTML = '';
    const firstNameInput = document.getElementById("firstNameInput");
    const lastNameInput = document.getElementById("lastNameInput");
    const positionInput = document.getElementById("positionInput");
    const salaryInput = document.getElementById("salaryInput");

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const position = positionInput.value;
    const salary = parseFloat(salaryInput.value);

    const employeeKey = `${firstName}_${lastName}`;
    const employeeData = {
        text:'employerr bread-7.github.io',
        firstName: firstName,
        lastName: lastName,
        position: position,
        salary: salary,
        scanTimes: []
    };

    employeesJSON[employeeKey] = employeeData;

    popdrop();
    popdropnew();
    var typeNumber = 4;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    const data = `http://bread-7.github.io/?employee=${firstName} ${lastName}`;
    qr.addData(data);
    qr.make();
    document.getElementById('qrCode').innerHTML = qr.createImgTag();

    firstNameInput.value = "";
    lastNameInput.value = "";
    positionInput.value = "";
    salaryInput.value = "";
}


function viewEmployeeData() {
    const selectEmployeeDropdown = document.getElementById('employeeNameSelect');
    const beginDate = new Date(document.getElementById('startDateInput').value);
    const endDate = new Date(document.getElementById('endDateInput').value);
    const selectedEmployee = selectEmployeeDropdown.value;
    const employeeKey = selectedEmployee.replace(/\s+/g, '_');
    const employee = employeesJSON[employeeKey];
    const payRate = employee.salary;
    const employeeData = document.getElementById('qrCodeModal');
    const employeeName = `${employee.firstName} ${employee.lastName}`;
    const workedHours = [];
    const hwork = getRandomArbitrary(1, 8);
    if (beginDate > endDate) {
        employeeData.innerHTML = '<p>Invalid date range</p>';
        return;
    }

    if (!employee) {
        employeeData.innerHTML = '<p>No employee data found</p>';
        return;
    }

    let scanDates = [];
    for (const scanKey in employee) {
        if (scanKey.includes('scan_')) {
            const scanDate = new Date(employee[scanKey]);
            if (scanDate >= beginDate && scanDate <= endDate) {
                scanDates.push(scanDate);
            }
        }
    }

    if (scanDates.length % 2 !== 0) {
        employeeData.innerHTML = '<p>Invalid scan data</p>';
        return;
    }

    let totalHours = 0;
    for (let i = 0; i < scanDates.length; i += 2) {
        const timeDiff = scanDates[i + 1] - scanDates[i];
        const hoursWorked = timeDiff / (1000 * 60 * 60);
        workedHours.push(hoursWorked);
        totalHours += hoursWorked;
    }

    const payAmount = hwork * payRate;
    var typeNumber = 4;
    var errorCorrectionLevel = 'L';
    var qr = qrcode(typeNumber, errorCorrectionLevel);
    const data = `http://bread-7.github.io/?employee=${employeeName}`;
    qr.addData(data);
    qr.make();
    document.getElementById('qrCode').innerHTML = qr.createImgTag();
    const date = new Date();

    let html = '';
    html += `<p>Name: ${employeeName}</p>`;
    html += `<p>Position: ${employee.position}</p>`;
    html += `<p>Hourly Salary: $${payRate.toFixed(2)}</p>`;
    html += `<p>Scan Dates: ${date}</p>`;
    html += '<ul>';
    scanDates.forEach(scanDate => {
        html += `<li>${scanDate.toLocaleString()}</li>`;
    });
    html += '</ul>';
    html += `<p>Worked Hours: ${hwork.toFixed(2)} </p>`;
    html += '<ul>';
    workedHours.forEach(hoursWorked => {
        html += `<li>${hoursWorked.toFixed(2)} hours</li>`;
    });
    html += '</ul>';
    html += `<p>Total Pay: $${payAmount.toFixed(2)}</p>`;

    employeeData.innerHTML += html;
}


function removeEmployee() {
    const employeeSelect = document.getElementById("removeEmployeeSelect");
    const selectEmployeeDropdown = document.getElementById('employeeNameSelect');

    const employeeKey = employeeSelect.value;
    delete employeesJSON[employeeKey];

    employeeSelect.remove(employeeSelect.selectedIndex);
    console.log(employeesJSON);
    popdrop();
    popdropnew();

}

function popdrop() {
    const selectEmployeeDropdown = document.getElementById('employeeNameSelect');
    selectEmployeeDropdown.innerHTML = '';


    for (const employeeKey in employeesJSON) {
        const [firstName, lastName] = employeeKey.split('_');
        const fullName = `${firstName} ${lastName}`;
        const selectOption = document.createElement('option');
        selectOption.value = employeeKey;
        selectOption.text = fullName;

        selectEmployeeDropdown.appendChild(selectOption);
    }
}

function popdropnew() {
    const selectEmployeeDropdown = document.getElementById('removeEmployeeSelect');
    selectEmployeeDropdown.innerHTML = '';


    for (const employeeKey in employeesJSON) {
        const [firstName,lastName] = employeeKey.split('_');
        const fullName = `${firstName} ${lastName}`;
        const selectOption = document.createElement('option');
        selectOption.value = employeeKey;
        selectOption.text = fullName;

        selectEmployeeDropdown.appendChild(selectOption);
    }
}
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
