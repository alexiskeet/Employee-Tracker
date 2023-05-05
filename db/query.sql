SELECT department.department_name AS department, roles.title
FROM roles
JOIN department
ON roles.department_id = department.id
ORDER BY department.department_name;

SELECT roles.roles_title AS roles, employee.first_name
FROM employee
JOIN roles
ON roles.roles_id = roles.id
ORDER BY roles.roles_title;