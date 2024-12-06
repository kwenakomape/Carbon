-- Create Roles table
CREATE TABLE Roles (
    role_id INT PRIMARY KEY AUTO_INCREMENT,
    role_name ENUM('Specialist', 'IT Manager', 'Member') NOT NULL
);

-- Create Members table
CREATE TABLE Members (
    member_id INT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    cell VARCHAR(20), -- Adjusted length for international formats
    joined_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    credits INT DEFAULT 0
);

-- Create Admin table
CREATE TABLE Admin (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL, -- Increased length for hashed passwords
    role_id INT,
    specialist_type ENUM('Biokineticist', 'Dietitian', 'Physiotherapist', 'IT Software Development'),
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Services table with description
CREATE TABLE Services (
    service_id INT PRIMARY KEY AUTO_INCREMENT,
    service_name VARCHAR(255) NOT NULL,
    service_description VARCHAR(255) NOT NULL, -- Added description column
    price DECIMAL(10, 2) NOT NULL,
    credit_cost INT NOT NULL
);

-- Create SpecialistServices table to link specialists with services
CREATE TABLE SpecialistServices (
    specialist_service_id INT PRIMARY KEY AUTO_INCREMENT,
    specialist_id INT,
    service_id INT,
    FOREIGN KEY (specialist_id) REFERENCES Admin(admin_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Appointments table without service_id
CREATE TABLE Appointments (
    appointment_id INT PRIMARY KEY AUTO_INCREMENT,
    member_id INT,
    specialist_id INT,
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    confirmed_date DATE DEFAULT NULL,
    status ENUM('Missed', 'Pending', 'Confirmed', 'Seen', 'Cancelled') NOT NULL,
    preferred_date1 DATE DEFAULT NULL,
    preferred_time_range1 VARCHAR(255) DEFAULT NULL,
    preferred_date2 DATE DEFAULT NULL,
    preferred_time_range2 VARCHAR(255) DEFAULT NULL,
    preferred_date3 DATE DEFAULT NULL,
    preferred_time_range3 VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (member_id) REFERENCES Members(member_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (specialist_id) REFERENCES Admin(admin_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Sessions table with appointment_id and service_id
CREATE TABLE Sessions (
    session_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    specialist_id INT,
    service_id INT,
    date DATE DEFAULT NULL,
    duration VARCHAR(50) NOT NULL,
    credits_used INT DEFAULT 0,
    amount DECIMAL(10, 2) DEFAULT 0,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (specialist_id) REFERENCES Admin(admin_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Payments table
CREATE TABLE Payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    amount DECIMAL(10, 2) DEFAULT NULL,
    payment_method VARCHAR(255) DEFAULT NULL, -- Changed to VARCHAR for flexibility
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Invoices table
CREATE TABLE Invoices (
    invoice_id INT PRIMARY KEY AUTO_INCREMENT,
    invoice_number VARCHAR(50) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    member_id INT,
    appointment_id INT,
    total_credits_used INT DEFAULT 0,
    total_amount DECIMAL(10, 2) DEFAULT 0.00,
    payment_method VARCHAR(255) DEFAULT NULL,
    FOREIGN KEY (member_id) REFERENCES Members(member_id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert roles
INSERT INTO Roles (role_name) VALUES
('Specialist'),
('IT Manager'),
('Member');

-- Insert data into Members table
INSERT INTO Members (member_id, email, name, cell, credits) VALUES
(920811, 'kwenakomape2@gmail.com', 'Kwena', '27609442412', 200),
(920845, 'jane.doe@example.com', 'Jane', '27814511463', 150),
(920938, 'augustnhila@ssisa.com', 'August', '27729723179', 180);

-- Insert data into Admin table
INSERT INTO Admin (name, email, password, role_id, specialist_type) VALUES
('Marvin Jacobs', 'marvinjacobs@gmail.com', 'SSISA!', 1, 'Biokineticist'),
('Marie', 'marie@gmail.com', 'SSISA!', 1, 'Dietitian'),
('Rashaad', 'rashaad@gmail.com', 'SSISA!', 1, 'Physiotherapist'),
('Natasha', 'natasha@gmail.com', 'SSISA!', 1, 'Dietitian'),
('IT Manager', 'itmanager@example.com', 'SSISA!', 2, 'IT Software Development');

-- Insert data into Services table
INSERT INTO Services (service_name, service_description, price, credit_cost) VALUES
-- Biokineticist Services
('Rehabilitation Program', 'Tailored exercise programs for recovery from injuries or surgeries.', 500.00, 50),
('Chronic Disease Management', 'Exercise interventions for conditions like diabetes, cardiovascular diseases, and obesity.', 400.00, 40),
('Sports Performance Enhancement', 'Training programs to improve athletic performance.', 600.00, 60),
('Pain Management', 'Exercise therapy to manage chronic pain conditions.', 450.00, 45),
('Geriatric Care', 'Programs to promote mobility and prevent falls in older adults.', 350.00, 35),

-- Dietitian Services
('Nutrition Counseling', 'Personalized advice on diet and nutrition.', 300.00, 30),
('Chronic Disease Management', 'Dietary plans for managing conditions like diabetes, hypertension, and high cholesterol.', 350.00, 35),
('Weight Management', 'Programs to help with weight loss or gain.', 250.00, 25),
('Meal Planning', 'Creating balanced meal plans tailored to individual needs.', 200.00, 20),
('Eating Disorder Recovery', 'Support and guidance for individuals recovering from eating disorders.', 400.00, 40),

-- Physiotherapist Services
('Musculoskeletal Rehabilitation', 'Treatment for injuries related to muscles, bones, and joints.', 500.00, 50),
('Post-Surgical Rehabilitation', 'Recovery programs following surgeries like joint replacements.', 550.00, 55),
('Neurological Rehabilitation', 'Therapy for conditions such as stroke, multiple sclerosis, and Parkinson\'s disease.', 600.00, 60),
('Cardiopulmonary Rehabilitation', 'Programs to improve heart and lung function.', 450.00, 45),
('Pediatric Therapy', 'Specialized care for children with developmental or physical disabilities.', 400.00, 40);

-- Insert data into SpecialistServices table
INSERT INTO SpecialistServices (specialist_id, service_id) VALUES
(1, 1), -- Biokineticist services
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 6), -- Dietitian services
(2, 7),
(2, 8),
(2, 9),
(2, 10),
(3, 11), -- Physiotherapist services
(3, 12),
(3, 13),
(3, 14),
(3, 15);

-- Insert data into Appointments table
-- INSERT INTO Appointments (member_id, specialist_id, status) VALUES
-- (920811, 1, 'Pending'),
-- (920811, 2, 'Pending'),
-- (920811, 3, 'Pending');

-- Insert data into Sessions table


-- Insert data into Invoices table
-- INSERT INTO Invoices (invoice_number, member_id, appointment_id, total_credits_used, total_amount) VALUES
-- ('INV-20241126-001', 920811, 1, 50, 500.00),
-- ('INV-20241126-002', 920811, 2, 40, 400.00),
-- ('INV-20241126-003', 920845, 3, 60, 600.00),
-- ('INV-20241126-004', 920811, 4, 50, 500.00),
-- ('INV-20241126-005', 920811, 5, 45, 450.00);


-- Index improvements for Members table
CREATE INDEX idx_members_email ON Members(email);

-- Index improvements for Admin table
CREATE INDEX idx_admin_email ON Admin(email);
CREATE INDEX idx_admin_role_id ON Admin(role_id);

-- Index improvements for Services table
CREATE INDEX idx_services_service_name ON Services(service_name);

-- Index improvements for SpecialistServices table
CREATE INDEX idx_specialistservices_specialist_id ON SpecialistServices(specialist_id);
CREATE INDEX idx_specialistservices_service_id ON SpecialistServices(service_id);

-- Index improvements for Appointments table
CREATE INDEX idx_appointments_member_id ON Appointments(member_id);
CREATE INDEX idx_appointments_specialist_id ON Appointments(specialist_id);
CREATE INDEX idx_appointments_status ON Appointments(status);

-- Index improvements for Sessions table
CREATE INDEX idx_sessions_appointment_id ON Sessions(appointment_id);
CREATE INDEX idx_sessions_specialist_id ON Sessions(specialist_id);
CREATE INDEX idx_sessions_service_id ON Sessions(service_id);

-- Index improvements for Payments table
CREATE INDEX idx_payments_appointment_id ON Payments(appointment_id);

-- Index improvements for Invoices table
CREATE INDEX idx_invoices_member_id ON Invoices(member_id);
CREATE INDEX idx_invoices_appointment_id ON Invoices(appointment_id);
CREATE INDEX idx_invoices_date ON Invoices(date);

SELECT 
    i.invoice_id,
    i.invoice_number,
    i.date AS invoice_date,
    i.total_credits_used,
    i.total_amount,
    i.payment_method,
    m.member_id,
    m.name AS member_name,
    m.email AS member_email,
    m.cell AS member_cell,
    s.session_id,
    s.date AS session_date,
    s.duration AS session_duration,
    s.credits_used AS session_credits_used,
    s.amount AS session_amount,
    sv.service_id,
    sv.service_name,
    sv.service_description,
    sp.admin_id AS specialist_id,
    sp.name AS specialist_name,
    sp.email AS specialist_email,
    sp.specialist_type
FROM 
    Invoices i
JOIN 
    Members m ON i.member_id = m.member_id
JOIN 
    Appointments a ON i.appointment_id = a.appointment_id
JOIN 
    Sessions s ON a.appointment_id = s.appointment_id
JOIN 
    Services sv ON s.service_id = sv.service_id
JOIN 
    Admin sp ON s.specialist_id = sp.admin_id
WHERE 
    i.appointment_id = 1;
UPDATE Appointments SET confirmed_date = 12-11-2024, status = 'Confirmed' WHERE member_id = 920811 AND appointment_id = 1;
UPDATE Sessions SET date = '2024-05-15' WHERE appointment_id = 1;
SELECT * FROM Roles;
SELECT * FROM Members;
SELECT * FROM Admin;
SELECT * FROM Services;
SELECT * FROM SpecialistServices;
SELECT * FROM Appointments;
SELECT * FROM Payments;
SELECT * FROM Invoices;
SELECT * FROM Sessions;
SELECT 
        a.appointment_id,
        a.member_id,
        m.name AS member_name,
        m.cell,
        a.request_date,
        a.confirmed_date,
        a.status,
        a.preferred_date1,
        a.preferred_time_range1,
        a.preferred_date2,
        a.preferred_time_range2,
        a.preferred_date3,
        a.preferred_time_range3,
        ad.name AS specialist_name,
        p.payment_method
    FROM 
        Appointments a
    JOIN 
        Members m ON a.member_id = m.member_id
    JOIN 
        Admin ad ON a.specialist_id = ad.admin_id
    LEFT JOIN 
        Payments p ON a.appointment_id = p.appointment_id
    WHERE 
        a.specialist_id = 1;
SELECT 
    Members.member_id,
    Members.email,
    Members.name AS member_name,
    Members.cell,
    Members.joined_date,
    Members.credits,
    Appointments.appointment_id,
    Appointments.request_date,
    Appointments.confirmed_date,
    Appointments.status,
    Admin.name AS specialist_name,
    Admin.specialist_type, -- Corrected to specialist_type
    Payments.payment_method
FROM 
    Members
LEFT JOIN 
    Appointments ON Members.member_id = Appointments.member_id
LEFT JOIN 
    Admin ON Appointments.specialist_id = Admin.admin_id
LEFT JOIN 
    Payments ON Appointments.appointment_id = Payments.appointment_id
WHERE 
    Members.member_id = 920811
ORDER BY 
    Members.member_id, Appointments.appointment_id;
    
    
SELECT 
    a.appointment_id,
    a.member_id,
    m.name AS member_name,
    m.cell,
    a.request_date,
    a.confirmed_date,
    a.status,
    a.preferred_date1,
    a.preferred_time_range1,
    a.preferred_date2,
    a.preferred_time_range2,
    a.preferred_date3,
    a.preferred_time_range3,
    ad.admin_id AS specialist_id,
    ad.name AS specialist_name,
    p.payment_method
FROM 
    Appointments a
JOIN 
    Members m ON a.member_id = m.member_id
JOIN 
    Admin ad ON a.specialist_id = ad.admin_id
LEFT JOIN 
    Payments p ON a.appointment_id = p.appointment_id
WHERE 
    ad.admin_id = 1
ORDER BY 
    a.appointment_id;

SELECT 
    a.appointment_id,
    a.member_id,
    m.name AS member_name,
    m.cell,
    a.request_date,
    a.confirmed_date,
    a.status,
    a.preferred_date1,
    a.preferred_time_range1,
    a.preferred_date2,
    a.preferred_time_range2,
    a.preferred_date3,
    a.preferred_time_range3,
    ad.admin_id AS specialist_id,
    ad.name AS specialist_name,
    i.payment_method,
    COALESCE(SUM(s.credits_used), 0) AS total_credits_used,
    COALESCE(SUM(s.amount), 0) AS total_amount
FROM 
    Admin ad
LEFT JOIN 
    Appointments a ON ad.admin_id = a.specialist_id
LEFT JOIN 
    Members m ON a.member_id = m.member_id
LEFT JOIN 
    Invoices i ON a.appointment_id = i.appointment_id
LEFT JOIN 
    Sessions s ON a.appointment_id = s.appointment_id
WHERE 
    ad.admin_id = 1
GROUP BY 
    a.appointment_id,
    a.member_id,
    m.name,
    m.cell,
    a.request_date,
    a.confirmed_date,
    a.status,
    a.preferred_date1,
    a.preferred_time_range1,
    a.preferred_date2,
    a.preferred_time_range2,
    a.preferred_date3,
    a.preferred_time_range3,
    ad.admin_id,
    ad.name,
    i.payment_method
ORDER BY 
    a.appointment_id;
    
DROP TABLE IF EXISTS Sessions;
DROP TABLE IF EXISTS Invoices;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS SpecialistServices;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Roles;

SELECT appointment_id, 
       SUM(credits_used) AS total_credits_used, 
       SUM(amount) AS total_amount
FROM Sessions
WHERE appointment_id = 2;

-- Insert data into Payments table
-- INSERT INTO Payments (appointment_id, amount, payment_method) VALUES
-- (1, 200.00, 'CASH/CARD'),
-- (2, 400.00, 'CASH/CARD'),
-- (3, NULL, 'Credits'),
-- (4, 300.00, 'CASH/CARD'),
-- (5, NULL, 'Credits');




