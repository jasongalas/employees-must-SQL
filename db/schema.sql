-- Create a new database
DROP DATABASE IF EXISTS llc_db;
CREATE DATABASE llc_db;

\c llc_db;

-- Create a departments table
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(255)
);

-- Create a roles table
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    FOREIGN KEY (department_id) 
    REFERENCES departments(department_id)
    ON DELETE SET NULL
);

-- Create an employees table
CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role_id INTEGER,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE SET NULL,
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id) ON DELETE SET NULL
);
