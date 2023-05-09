const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

Connection.connect(function(err) {
    if (err) throw err;
    initialPrompts();
});

function initialPrompts(){
    inquirer.prompt([
        {
            type: 'list',
            name: 'input',
            message: 'What would you like to do?',
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 'View All Roles', 'Add Role', 'View All Departments', 'Add Department', 'Exit']
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
        else if (response.input === 'Exit') {
            exit();
            return;
        }
    })
}

//viewAllEmployees()

//addEmployee()

//updateEmployeeRole()

//viewAllRoles()

//addRole()

//viewAllDepartments();

//addDepartment()

//exit()


const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: '01252003Ak.',
        database: 'employee_db'
    },
    console.log('Connected to the employee_db database')
);

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