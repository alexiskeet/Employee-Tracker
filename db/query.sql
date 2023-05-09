SELECT department.name AS department, roles.title
FROM roles
JOIN department
ON roles.department_id = department.id
ORDER BY department.department_name;

SELECT roles.title AS roles, employee.first_name
FROM employee
JOIN roles
ON employee.roles_id = roles.id
ORDER BY roles.title;