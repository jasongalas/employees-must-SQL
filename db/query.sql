SELECT 
    employees.employee_id AS id,
    employees.first_name,
    employees.last_name,
    roles.title AS job,
    departments.department_name AS department,
    roles.salary,
    CONCAT(managers.first_name, ' ', managers.last_name) AS manager
FROM 
    employees
INNER JOIN roles ON employees.role_id = roles.role_id
LEFT JOIN departments ON roles.department_id = departments.department_id
LEFT JOIN employees AS managers ON employees.manager_id = managers.employee_id;
