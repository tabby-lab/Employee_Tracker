const mysql = require("mysql");
const inquirer = require("inquirer")
require("console.table")
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "64Riderr",
    database: "employee_db",
});

connection.connect(function (err) {
    if (err) throw (err);

    start();
});

function start() {
    inquirer
        .prompt({
            name: "options",
            type: "list",
            message: "What would you like to do?",
            choices: ["View All Employees", "View All Employees by Department", "View All Employees by Manager",
                "Add Employee", "Remove Employee", "Update Employee Role", "Update Employee Manager"]
        })



        //need a then function and else if/else
        //replace with switch
        .then(function (answer) {
            if (answer.options === "View All Employees") {
                viewAllEmployee();
                
            }
            else if (answer.options === "View All Employees by Department") {
                viewAllEmployeesByDepartment();
            } else if (answer.options === "View All Employees by Manager") {
                viewAllEmployeesByManager();
            } else if (answer.options === "Add Employee") {
                addEmployee();
            } else if (answer.options === "Remove Employee") {
                removeEmployee();
            } else if (answer.options === "Update Employee Role") {
                updateEmployeeRole();
            } else if (answer.options === "Update Employee Manager") {
                updateEmployeeManager();
            }
           
        });
}
//wtf
function viewAllEmployee() {
    connection.query(`
SELECT employee.id,employee.first_name,employee.last_name 
,role.title,role.salary ,department.name department,
concat(employee2.first_name," ", employee2.last_name) manager
FROM employee 
LEFT JOIN role on employee.role_id=role.id
LEFT JOIN employee employee2 on employee.manager_id=employee2.id
LEFT JOIN department on department.id=role.department_id
`, function (err, data) {
        console.table(data)

       //// start()
        
    })


}

function viewAllEmployeesByDepartment() {
connection.query(`SELECT employee.id,employee.first_name,employee.last_name 
,role.title,role.salary ,department.name department,
concat(employee2.first_name," ", employee2.last_name) manager
FROM employee 
LEFT JOIN role on employee.role_id=role.id
LEFT JOIN employee employee2 on employee.manager_id=employee2.id
LEFT JOIN department on department.id=role.department_id order by department`,function(err,data){
    console.table(data)
})
}

function viewAllEmployeesByManager() {

}
function addEmployee() {

}
function removeEmployee() {

}

function updateEmployeeRole() {

}
function updateEmployeeManager() {

}
