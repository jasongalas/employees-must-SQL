//global variables calling inquirer, pool, fs, and the dotenv
const inquirer = require("inquirer");
const { Pool } = require('pg');
const fs = require("fs");
require('dotenv').config();

// Read the SQL query from the file
const query = fs.readFileSync('./db/query.sql', 'utf8');

// Connect to the database
const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE
});

console.log(`Connected to the database.`);

// Create a function to initialize the inquirer
async function init() {
    let client;
    try {
        client = await pool.connect();

        while (true) {
            // the Q&A for navigating the command line prompts
            const answers = await inquirer.prompt([
                {
                    type: "list",
                    message: "Welcome! Here are your options:",
                    name: "login",
                    choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee", "quit"],
                }
            ]);

            switch (answers.login) {
                case "view all departments":
                    const departments = await client.query('SELECT department_id, department_name FROM departments;');
                    console.table(departments.rows);
                    break;
                case "view all roles":
                    const roles = await client.query('SELECT * FROM roles');
                    console.table(roles.rows);
                    break;
                case "view all employees":
                    const employees = await client.query(query);
                    console.table(employees.rows);
                    break;
                case "add a department":
                    const addDepartment = await inquirer.prompt([
                        {
                            type: "input",
                            message: "What department would you like to add?",
                            name: "newDepartment",
                        }
                    ]);
                    await client.query('INSERT INTO departments (department_name) VALUES ($1)', [addDepartment.newDepartment]);
                    console.log("Department added successfully!");
                    break;
                case "add a role":
                    try {
                        // Query the database to get existing departments
                        const departmentRecords = await client.query('SELECT * FROM departments');
                        const departmentChoices = departmentRecords.rows.map(department => department.department_name);
                
                        const addRole = await inquirer.prompt([
                            {
                                type: "input",
                                message: "What role would you like to add?",
                                name: "newRole"
                            },
                            {
                                type: "input",
                                message: "What does the new role pay?",
                                name: "newSalary",
                            },
                            {
                                type: "list",
                                message: "What department is the new role in?",
                                name: "department",
                                choices: departmentChoices
                            },
                        ]);
                        // Retrieve the department_id for the selected department
                        const selectedDepartment = departmentRecords.rows.find(department => department.department_name === addRole.department);
                        const departmentId = selectedDepartment.department_id;
                        
                        await client.query('INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3)', [addRole.newRole, addRole.newSalary, departmentId]);
                        console.log("Role added successfully!");
                    } catch (error) {
                        console.error('Error executing query:', error.message);
                    }
                    break;
                    
                case "add an employee":
                    try {
                        // Query the database to get existing roles
                        const roleRecords = await client.query('SELECT * FROM roles');
                        const roleChoices = roleRecords.rows.map(role => role.title);
            
                        // Query the database to get existing managers
                        const employeeRecords = await client.query('SELECT * FROM employees');
                        const managerChoices = employeeRecords.rows.map(employee => `${employee.first_name} ${employee.last_name}`);
            
                        const addEmployee = await inquirer.prompt([
                            {
                                type: "input",
                                message: "What is the new employee's first name?",
                                name: "newFirstName",
                            },
                            {
                                type: "input",
                                message: "What is the new employee's last name?",
                                name: "newLastName",
                            },
                            {
                                type: "list",
                                message: "What is the new employee's role?",
                                name: "role",
                                choices: roleChoices,
                            },
                            {
                                type: "list",
                                message: "Who is the new employee's manager?",
                                name: "manager",
                                choices:  ['None', ...managerChoices],
                            },
                        ]);
                        const selectedRole = roleRecords.rows.find(role => role.title === addEmployee.role);
                        const roleId = selectedRole.role_id;
                
                        // Retrieve the manager_id for the selected manager
                        let managerId = null;
                        if (addEmployee.manager !== 'None') {
                            const selectedManagerName = addEmployee.manager.split(' ');
                            const selectedManager = employeeRecords.rows.find(employee => 
                                employee.first_name === selectedManagerName[0] && employee.last_name === selectedManagerName[1]);
                            managerId = selectedManager.employee_id;
                        }
                
                        await client.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)', [addEmployee.newFirstName, addEmployee.newLastName, roleId, managerId]);
                        console.log("Employee added successfully!");
                    } catch (error) {
                        console.error('Error executing query:', error.message);
                    }
                    break;

                case "update an employee":
                    try {
                        // Query the database to get existing employees
                        const employeeRecords = await client.query('SELECT * FROM employees');
                        const employeeChoices = employeeRecords.rows.map(employee => `${employee.first_name} ${employee.last_name}`);
                
                        // Query the database to get existing roles
                        const roleRecords = await client.query('SELECT * FROM roles');
                        const roleChoices = roleRecords.rows.map(role => role.title);
                
                        const updateEmployee = await inquirer.prompt([
                            {
                                type: "list",
                                message: "Which employee do you want to update?",
                                name: "updateEmployeeName",
                                choices: employeeChoices
                            },
                            {
                                type: "list",
                                message: "Which role do you want to give them?",
                                name: "updateRoleTitle",
                                choices: roleChoices
                            },
                        ]);   
                
                        // Retrieve the employee_id for the selected employee
                        const selectedEmployeeName = updateEmployee.updateEmployeeName.split(' ');
                        const selectedEmployee = employeeRecords.rows.find(employee => 
                            employee.first_name === selectedEmployeeName[0] && employee.last_name === selectedEmployeeName[1]);
                        const employeeId = selectedEmployee.employee_id;
                
                        // Retrieve the role_id for the selected role
                        const selectedRole = roleRecords.rows.find(role => role.title === updateEmployee.updateRoleTitle);
                        const roleId = selectedRole.role_id;
                
                        // Perform the update query
                        await client.query('UPDATE employees SET role_id = $1 WHERE employee_id = $2', [roleId, employeeId]);
                        console.log("Employee updated successfully!");
                    } catch (error) {
                        console.error('Error executing query:', error.message);
                    }
                    break;
                                
                case "quit":
                    console.log("Exiting...");
                    return; // Exit the function
            }
        }
    } catch (error) {
        console.error('Error executing query:', error.message);
    } finally {
        if (client) {
            client.release(); // Release the client back to the pool
        }
    }
}

init();
