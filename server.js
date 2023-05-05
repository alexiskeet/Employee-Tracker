const express = require('express');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'root',
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

    brotliDecompress.query(sql, (err, data) => {
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

app.get('/api/role', (req,res) => {
    const sql = `SELECT department.department_name AS department, role.role_title FROM role LEFT JOIN department ON role.department_id = department.id ORDER BY department.department_name;`;
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
    const sql = `SELECT role.role_title AS role, employee.first_name FROM employee LEFT JOIN role ON employee.role_id = role.id ORDER BY role.role_title; `;
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