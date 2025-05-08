-- Roles table remains the same
CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM('Specialist', 'IT Manager', 'Member') NOT NULL
);

-- Members table WITHOUT password field
CREATE TABLE Members (
    member_id INT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    cell VARCHAR(20),
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    credits INT DEFAULT 2,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Enhanced Admin table with security features
CREATE TABLE Admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Hashed password
    role_id INT,
    specialist_type ENUM('Biokineticist', 'Dietitian', 'Physiotherapist', 'IT Software Development'),
    last_password_change TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    failed_login_attempts INT DEFAULT 0,
    account_locked BOOLEAN DEFAULT FALSE,
    last_login TIMESTAMP NULL,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);


-- Insert roles
INSERT INTO Roles (role_name) VALUES
('Specialist'),
('IT Manager'),
('Member');

-- Insert members (NO passwords)
INSERT INTO Members (member_id, email, name, cell, role_id) VALUES
(920811, 'kwenakomape2@gmail.com', 'Kwena', '27696742412', 3),
(920938, 'augustnhila@ssisa.com', 'August', '277345723179', 3),
(920845, 'jane.doe@example.com', 'Jane', '27814511463', 3);

-- Insert admins with hashed default password
INSERT INTO Admin (name, email, password, role_id, specialist_type) VALUES
('Marvin Jacobs', 'marvinjacobs@gmail.com', '$2b$12$E9Y1uFcZx3hL2pN4r5XvO.9Xz8vQ1wR2sT3uV4y5A6B7C8D9E0F', 1, 'Biokineticist'),
('Marie', 'marie@gmail.com', '$2b$12$E9Y1uFcZx3hL2pN4r5XvO.9Xz8vQ1wR2sT3uV4y5A6B7C8D9E0F', 1, 'Dietitian'),
('Rashaad', 'rashaad@gmail.com', '$2b$12$E9Y1uFcZx3hL2pN4r5XvO.9Xz8vQ1wR2sT3uV4y5A6B7C8D9E0F', 1, 'Physiotherapist'),
('Natasha', 'natasha@gmail.com', '$2b$12$E9Y1uFcZx3hL2pN4r5XvO.9Xz8vQ1wR2sT3uV4y5A6B7C8D9E0F', 1, 'Dietitian'),
('IT Manager', 'itmanager@example.com', '$2b$12$E9Y1uFcZx3hL2pN4r5XvO.9Xz8vQ1wR2sT3uV4y5A6B7C8D9E0F', 2, 'IT Software Development');
