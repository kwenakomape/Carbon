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
    credits INT DEFAULT 2,
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id) ON DELETE CASCADE ON UPDATE CASCADE
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
    confirmed_time  VARCHAR(255) DEFAULT NULL,
    booking_type ENUM('Referral', 'Standard') NOT NULL,
	notes_status ENUM('Not Started', 'Completed') NOT NULL,
    status ENUM('Missed', 'Pending', 'Confirmed', 'Seen', 'Cancelled','Rescheduled','Scheduled','Pending Reschedule') NOT NULL,
    payment_method VARCHAR(255) DEFAULT NULL,
    invoice_status VARCHAR(20) DEFAULT 'INVOICE_PENDING',
    payment_status VARCHAR(20) DEFAULT 'Pending',
    specialist_name VARCHAR(255) DEFAULT NULL,
    invoice_file BLOB,
    credits_used INT DEFAULT 0,
    preferred_date1 DATE DEFAULT NULL,
    preferred_time_range1 VARCHAR(255) DEFAULT NULL,
    preferred_date2 DATE DEFAULT NULL,
    preferred_time_range2 VARCHAR(255) DEFAULT NULL,
    preferred_date3 DATE DEFAULT NULL,
    preferred_time_range3 VARCHAR(255) DEFAULT NULL,
    booked_by VARCHAR(255) DEFAULT NULL,
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

CREATE TABLE Notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    appointment_id INT,
    notification_type ENUM('Booking Request', 'Cancellation', 'Rescheduling', 'Confirmation') NOT NULL,
    message VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (appointment_id) REFERENCES Appointments(appointment_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insert roles
INSERT INTO Roles (role_name) VALUES
('Specialist'),
('IT Manager'),
('Member');

-- Insert data into Members table
INSERT INTO Members (member_id, email, name, cell,role_id) VALUES
(920811, 'kwenakomape2@gmail.com', 'Kwena', '27609442412',3),
(920938, 'augustnhila@ssisa.com', 'August', '27729723179',3);

INSERT INTO Members (member_id, email, name, cell,credits,role_id) VALUES
(920845, 'jane.doe@example.com', 'Jane', '27814511463',3,3);

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

UPDATE Appointments SET confirmed_date = 12-11-2024, status = 'Confirmed' WHERE member_id = 920811 AND appointment_id = 1;
UPDATE Sessions SET date = '2024-05-15' WHERE appointment_id = 1;
SELECT * FROM Roles;
SELECT * FROM Members;
SELECT * FROM Admin;
SELECT * FROM Appointments;
SELECT * FROM Notifications;
SELECT * FROM Services;
SELECT * FROM SpecialistServices;
SELECT * FROM Payments;
SELECT * FROM Sessions;

DROP TABLE IF EXISTS Sessions;
DROP TABLE IF EXISTS Notifications;
DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS SpecialistServices;
DROP TABLE IF EXISTS Services;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Roles;

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
      Appointments.confirmed_time,
      Appointments.status,
      Appointments.specialist_id,
      Appointments.invoice_status,
      Appointments.payment_status,
      Appointments.specialist_name,
      Appointments.preferred_date1,
      Appointments.preferred_time_range1,
      Appointments.preferred_date2,
      Appointments.preferred_time_range2,
      Appointments.preferred_date3,
      Appointments.preferred_time_range3,
      Admin.specialist_type
    FROM 
      Members
    LEFT JOIN 
      Appointments ON Members.member_id = Appointments.member_id
    LEFT JOIN 
      Admin ON Appointments.specialist_id = Admin.admin_id
    WHERE 
      Members.member_id = 920811
    ORDER BY 
      Members.member_id, Appointments.appointment_id;


