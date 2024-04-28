INSERT INTO departments (department_name)
    VALUES
    ('Department of Vogue'),
    ('Department of Shade'),
    ('Department of Herstory'),
    ('HR');

INSERT INTO roles (title, salary, department_id)
    VALUES
    ('Queen of Flips', 100000, 1),
    ('Dancing Queen', 90690, 1),
    ('Herstory Professor', 85000, 3),
    ('Astrologist', 79000, 2),
    ('Karen from HR', 84000, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
      VALUES
        ('Ivana', 'Twinkle', 1, NULL),
        ('Sharon', 'Snacks', 3, NULL),
        ('Amanda', 'Slap', 4, 3),
        ('Anita', 'Dancer', 2, NULL),
        ('Richard', 'Hartman', 5, 5);