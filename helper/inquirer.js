//global variables calling inquirer, file system, and the code to generate SVG information
const inquirer = require("inquirer");
const { Pool } = require('pg');
const db = require('db');

// Connect to the database
const pool = new Pool(
    
    db.connect({
      // TODO: Enter PostgreSQL username
      user: process.env.DB_USER,
      // TODO: Enter PostgreSQL password
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE
    }),
    console.log(`Connected to the database.`)
  )
  
  pool.connect();
    
// Create a function to initialize the inquirer
function init() {
      //the Q&A for navigating the command line prompts
    inquirer
        .prompt([
            {
                type: "list",
                message: "Welcome. Here are your options:",
                name: "login",
                choices: ["view all departments", "view all roles", "view all employees", "add a department", "add a role", "add an employee", "update an employee role"],
            },
            {
                when: input => {
                    return input.login == "view all departments"
                },
            },
            {
                when: input => {
                    return input.login == "view all roles"
                },
            },
            {
                when: input => {
                    return input.login == "view all employees"
                },
            },
            {
                when: input => {
                    return input.login == "add a department"
                },
                type: "input",
                message: "What department would you like to add?",
                name: "newDepartment",
            },
            {
                when: input => {
                    return input.login == "add a role"
                },
                type: "input",
                message: "What role would you like to add?",
                name: "newRole",
            },
            {
                when: input => {
                    return input.login == "add an employee"
                },
                type: "input",
                message: "What is the new employee's first name?",
                name: "newFirstName",
            },
        ]).then((inquirerResponses) => {

            const results = inquirerResponses;

            // Write SVG data to file
            writeToSVG("./examples/logo.svg", results);
        });
    
}
    
// Function call to initialize app
init();