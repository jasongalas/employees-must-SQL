-- Create a new database
DROP DATABASE IF EXISTS llc_db;
CREATE DATABASE llc_db;

\c llc_db;

-- Create a department table
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255)
);

-- Create a role table
CREATE TABLE role (
    role_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    salary DECIMAL NOT NULL,
    department_id INTEGER,
    FOREIGN KEY (department_id) REFERENCES department(department_id),
);

-- Create an employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(role_id),
    PRIMARY KEY (manager_id) REFERENCES employee(employee_id)
);
