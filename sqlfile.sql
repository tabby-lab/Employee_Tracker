USE employee_db;
SELECT *
FROM employee;
SELECT *
FROM role;

SELECT employee.id,employee.first_name,employee.last_name 
,role.title,role.salary ,department.name department,
concat(employee2.first_name," ", employee2.last_name) manager
FROM employee 
LEFT JOIN role on employee.role_id=role.id
LEFT JOIN employee employee2 on employee.manager_id=employee2.id
LEFT JOIN department on department.id=role.department_id order by department