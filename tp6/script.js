var employees = [];
var companies = [];

const url = 'https://utn-avanzada2-tp6.herokuapp.com/';

function getCompanies() {
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('GET',url+'api/Company');
        request.responseType = 'json';
        request.onload = function () {
            if(request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error("There has been some error loading the companies pls try later..."));
            }
        };
        request.onerror = function () {
            reject(Error("Error, connection faild"));
        };
        request.send();
    });
}

function getEmployees(){
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('GET',url+'api/Employee');
        request.responseType = 'json';
        request.onload = function () {
            if(request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error("There has been some error loading the employees pls try later..."));
            }
        };
        request.onerror = function () {
            reject(Error("Error, connection faild"));
        };
        request.send();
    });
}

window.onload = async () => {
    employees = await getEmployees();
    companies = await getCompanies();

    generateForm(companies);
    generateTable(employees, companies);
};

function deleteEmployee(id) {
    return new Promise(function(resolve, reject){
        var request = new XMLHttpRequest();
        request.open('DELETE',url+'api/Employee/'+id);
        request.responseType = 'json';
        request.onload = function () {
            if(request.status === 200) {
                resolve(request.response);
            } else {
                reject(Error("There has been some error loading the employees pls try later..."));
            }
        };
        request.onerror = function () {
            reject(Error("Error, connection faild"));
        };
        request.send();
    });
}

function generateForm(companies) {
    var select = document.getElementById('selectCompany');
    
    companies.forEach(company => {
        var option = document.createElement('option');

        option.text = company.companyId+ ' ' + company.name;
        option.value = company.companyId;
        select.add(option);
        
    });
}

function generateTable(employees, companies) {
    let tbody;
    let trElement;
    let tdCompanyId;
    let tdCompanyIdNode;
    let tdCompanyName;
    let tdCompanyNameNode;
    let tdFirstName;
    let tdFirstNameNode;
    let tdLastName;
    let tdLastNameNode;
    let tdEmail;
    let tdEmailNode;

    let tdDeleteButton;
    let tdDeleteButtonNode;

    employees.forEach(element => {

        tbody = document.querySelector('tbody');
        trElement = document.createElement('tr');

        //aca agrego botones
        tdDeleteButton = document.createElement('button');
        tdDeleteButtonNode = document.createTextNode('Delete');
        // tdDeleteButton.addEventListener ("click", function() {
        //     deleteEmployee(element.employeeId);

        //     getEmployees().then(value => {
        //         employees = value;
        //         generateTable(employees,companies);//esto no funco como queria jaja

        //     }
        //     );
        //   });

        tdDeleteButton.addEventListener ("click", async function() {
            deleteEmployee(element.employeeId);

            await getEmployees().then(value => {//creo q el await no hace falta (por lo menos anda sin eso)
                employees = value;
                generateTable(employees,companies);
                location.reload();
            }
            );
          });

        tdDeleteButton.appendChild(tdDeleteButtonNode);

        tdFirstName = document.createElement('td');
        tdFirstNameNode = document.createTextNode(element.firstName);
        tdFirstName.appendChild(tdFirstNameNode);

        tdLastName = document.createElement('td');
        tdLastNameNode = document.createTextNode(element.lastName);
        tdLastName.appendChild(tdLastNameNode);

        tdEmail = document.createElement('td');
        tdEmailNode = document.createTextNode(element.email);
        tdEmail.appendChild(tdEmailNode);

        let company = companies.find(obj => obj.companyId === element.companyId)

        tdCompanyId = document.createElement('td');
            
        tdCompanyName = document.createElement('td');
            

        if (company) {
            tdCompanyIdNode = document.createTextNode(company.companyId);
            tdCompanyId.appendChild(tdCompanyIdNode);

            tdCompanyNameNode = document.createTextNode(company.name);
            tdCompanyName.appendChild(tdCompanyNameNode);
        }

        trElement.appendChild(tdFirstName);
        trElement.appendChild(tdLastName);
        trElement.appendChild(tdEmail);
        trElement.appendChild(tdCompanyId);
        trElement.appendChild(tdCompanyName);

        trElement.appendChild(tdDeleteButton);

        tbody.appendChild(trElement);
    });
}

function addEmployee(json){
    return new Promise(function(resolve, reject){


        var request = new XMLHttpRequest();
        request.open('POST',url+'api/Employee');

        request.setRequestHeader("Accept", "application/json");
        request.setRequestHeader('Content-Type', 'application/json');
 
        request.responseType = 'json';
        request.onload = function () {
            if(request.status === 200){
                resolve(request.response);
            }
            else{
                reject(Error("Error, the client already exists"));
            }
        };
        request.onerror = function () {
            reject(Error("Error, the client already exists"));
        };
        request.send(JSON.stringify(json));
    })
}

function createEmployee() {
    employeeId = document.getElementById("employeeId").value;

    var e = document.getElementById('selectCompany');
    let selected = e.selectedIndex;

    companyId = e[selected].value;

    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;
    email = document.getElementById("email").value;

    let json = {
        "employeeId": parseInt(employeeId),
        "companyId": parseInt(companyId),
        "firstName": firstName,
        "lastName": lastName,
        "email": email
    }

    addEmployee(json)
        .then(value => {
       console.log(value);
    });

    getEmployees().then(value => {
        employees = value;
        generateTable(employees,companies);
        location.reload();
    });
}