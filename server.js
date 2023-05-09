const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '01252003Ak.',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database')
);

db.connect(function(err) {
    if (err) throw err;
    initialPrompts();
});

//menu
function initialPrompts(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'input',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        }
    ]) .then(function(response) {
        if(response.input === 'View All Employees') {
            viewAllEmployees();
            return;
        }
        else if (response.input === 'Add Employee') {
            addEmployee();
            return;
        }
        else if (response.input === 'Update Employee Role') {
            updateEmployeeRole();
            return;
        }
        else if (response.input === 'View All Roles') {
            viewAllRoles();
            return;
        }
        else if (response.input === 'Add Role') {
            addRole();
            return;
        }
        else if (response.input === 'View All Departments') {
            viewAllDepartments();
            return;
        }
        else if (response.input === 'Add Department') {
            addDepartment();
            return;
        }
        // else if (response.input === 'Exit') {
        //     exit();
        //     return;
        // }
    })
}

//viewAllEmployees()
function viewAllEmployees() {
const query = 'Select * FROM employee';
db.query(query, function (err, response) {
    if(err) throw err;
    console.table(response);
    initialPrompts();
});
}

//addEmployee()

function addEmployee() {
inquirer.prompt([
    {
        type: 'input',
        name: 'employeeFirst',
        message: 'What is the employees first name?'
    },
    {
        type: 'input',
        name: 'employeeLast',
        message: 'What is the employees last name?'
    },
    {
        type: 'input',
        name: 'employeeRoleID',
        message: 'What is the employees role id?'
    },
    {
        type: 'input',
        name: 'employeeManagerID',
        message: 'What is this employees manager ID?'
    }
])
.then (function(response) {
db.query('INSERT INTO employee (first_name, last_name, roles_id, manager_id) VALUES (?, ?, ?, ?)', [response.employeeFirst, response.employeeLast, response.employeeRoleID, response.employeeManagerID], function(err, response) {
    if (err) throw err;
    console.table(response);
    initialPrompts();
});
});
}

//updateEmployeeRole()
function updateEmployeeRole () {
    inquirer.prompt([
        {
            type: 'input',
            name: 'employeeUpdate',
            message: 'Which employee are you updating?'
        },
        {
            type: 'input',
            name: 'employeeUpdateRole',
            message: 'Which role would you like to switch your employee to?'
        }
    ])
    .then (function(response) {
        db.query('UPDATE employee SET roles_id=? WHERE first_name=?', [response.employeeUpdateRole, answer.employeeUpdate], function(err, response) {
            if (err) throw err;
            console.table(response);
            initialPrompts();
        });
    });
}

//viewAllRoles()
function viewAllRoles(){
const query = 'SELECT * FROM roles';
db.query(query, function(err, response) {
    if (err) throw (err);
    console.table(response);
    initialPrompts();
});
}

//addRole()
function AddRole() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roleType',
            message: 'What is the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        },
        {
            type: 'input',
            name: 'department',
            message: 'What is the department id this role belongs to?'
        }
    ])
    .then(function(resposne) {
        db.query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [response.roleType, response.salary, response.department], function(err, response) {
            if (err) throw err;
            console.table(response);
            initialPrompts();
        });
    });
}

//viewAllDepartments();
function viewAllDepartments(){
    const query = 'SELECT * FROM department';
    db.query(query, function(err, response) {
        if (err) throw (err);
        console.table(response);
        initialPrompts();
    });
    }

//addDepartment()
function addDepartment() {
inquirer.prompt() ([
    {
        type: 'input',
        name: 'departmentName',
        message: 'What is this departments name?'
    }
])
.then(function(resposne) {
    db.query('INSERT INTO department (name) VALUES (?)', [response.departmentName], function(err, response) {
        if (err) throw err;
        console.table(response);
        initialPrompts();
    });
});
}

//exit()
// write this in later to exit 



app.post('/api/new-department', ({ body }, res) => {
    const sql = `INSERT INTO department (department_name) 
    VALUES (?)`;
    const params = [body.department_name];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: body
        });
    });
});

app.get('/api/department', (req, res) => {
    const sql = `SELECT id, department_name AS name FROM department`;

    db.query(sql, (err, data) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json ({
            message: 'success',
            data
        });
    });
});

app.delete('/api/department/:id', (req, res) => {
    const sql = `DELETE FROM department WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json({
                message: 'Department not found'
            });
        } else {
            res.json({
                message: 'deleted',
                changes: result.affectedRows,
                id: req.params.id
            });
        }
    });
});

app.get('/api/roles', (req,res) => {
    const sql = `SELECT department.department_name AS department, roles.roles_title FROM roles LEFT JOIN department ON roles.department_id = department.id ORDER BY department.department_name;`;
    db.query(sql, (err,rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.get('/api/employee', (req, res) => {
    const sql = `SELECT roles.roles_title AS roles, employee.first_name FROM employee LEFT JOIN roles ON employee.roles_id = roles.id ORDER BY roles.roles_title; `;
    db.query(sql, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});

app.use((req, res) => {
    res.status(400).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});