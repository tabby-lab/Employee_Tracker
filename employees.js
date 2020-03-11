const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");
let titleList = [];
let managerList = [];

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
            choices: ["View All Employees", "View All Departments", "View All Roles", "View All Employees by Manager",
                "Add Employee", "Add Role", "Add Department"]
        })

        .then(function (answer) {
            if (answer.options === "View All Employees") {
                viewAllEmployee();
            } else if (answer.options === "View All Departments") {
                viewAllDepartments();
            } else if (answer.options === "View All Roles") {
                viewAllRoles();
            } else if (answer.options === "View All Employees by Manager") {
                viewAllEmployeesByManager();
            } else if (answer.options === "Add Employee") {
                addEmployee();
            } else if (answer.options === "Add Role") {
                addRole();
            } else if (answer.options === "Add Department") {
                addDepartment();
            }

        });
}
//VIEW EMPLOYEES////////////////////////////////////////////////////////////////////////////////////
function viewAllEmployee() {
    connection.query(`SELECT employee.id,employee.first_name,employee.last_name 
,role.title,role.salary ,department.name department,
concat(employee2.first_name," ", employee2.last_name) manager
FROM employee 
LEFT JOIN role on employee.role_id=role.id
LEFT JOIN employee employee2 on employee.manager_id=employee2.id
LEFT JOIN department on department.id=role.department_id
`, function (err, data) {
        console.table(data)

    })
    start();
}
//VIEW EMPLOYEE BY DEPT///////////////////////////////////////////////////////////////////////////
function viewAllDepartments() {
    connection.query("SELECT name FROM department", function (err, res) {
        if (err) throw err;
        console.table(res)
    })
    start();
}

//VIEW ROLES///////////////////////////////////////////////////////////
function viewAllRoles() {
    connection.query("SELECT title FROM role", function (err, res) {
        if (err) throw err;
        console.table(res);

    })
    start();
}

//VIEW EMPLOYEE BY MANAGER///////////////////////////////////////////////////////////////////////
function viewAllEmployeesByManager() {
    connection.query("SELECT manager_id,first_name,last_name FROM employee", function (err, res) {
        if (err) throw (err);
        console.table(res);
    });

}
// ADD EMPLOYEE////////////////////////////////////////////////////////////////////////
function managerOption() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee WHERE manager_id IS NOT NULL", function (err, data) {
            if (err) throw err;
            resolve(data);
        });
    });
}

function roleOption() {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM role", function (err, data) {
            if (err) throw err;
            resolve(data);
        });
    })
}

function addEmployee() {

    roleOption().then(function (titles) {
        titleList = titles.map(role => role.title);

        console.log(titles);

        managerOption().then(function (manager) {
            //console.log(manager);
            managerList = manager.map(item => item.first_name + " " + item.last_name);

            inquirer.prompt([{
                name: "firstName",
                type: "input",
                message: "What is the employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee's last name?"

            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's role?",
                choices: titleList
            },
            {
                name: "manager",
                type: "list",
                message: "Who is the employee manager?",
                choices: managerList
            }])
                .then(function (input) {

                    const mySeelectedRole = titles.find(item => item.title === input.role);
                    const mySelectedManager = manager.find(item => (item.first_name + " " + item.last_name) === input.manager);
                    console.log(mySelectedManager.manager_id)
                    connection.query(`INSERT INTO employee(first_name, last_name, role_id,manager_id) VALUES ("${input.firstName}", "${input.lastName}", ${mySeelectedRole.id}, "${mySelectedManager.id}")`,
                        function (err, res) {
                            if (err) throw err;
                        }

                    );
                    start();

                });
        });
    });
}
//ADD DEPARTMENT/////////////////////////////////////////////////////////
function addDepartment(){
    inquirer.prompt([{
        name: "department",
        type: "input",
        message: "What department would you like to add?"
    }])
    .then(function(input){
        connection.query(`INSERT INTO department (name) VALUES("${input.department}")`,function(err,res){
            if (err) throw err;
            console.table(viewAllDepartments());
            start();
        })
    })
}



// "UPDATE role SET new role/////////////////////////////////////////////////////
// function updateEmployeeRole() {
//     connection.query("UPDATE role_id SET title = '' WHERE id = 2");
// }


//REMOVE BONUS
// function removeEmployee() {
//     connection.query('DELETE FROM employee WHERE  = 1', (err, result) => {
//         if (err) throw err;

//         console.log(`Deleted ${result.affectedRows} row(s)`);
//     });
    //maybe use this?
    //app.delete('/employee/:id',(req,res)=>{
    //connection.query("SELECT * FROM employee WHERE employee_id")
    //}
// }