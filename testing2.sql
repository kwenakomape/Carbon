CREATE TABLE Members (
    Id_No INT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Joined_Date DATE,
    Points INT DEFAULT 0
);
CREATE TABLE Members (
    Id_No INT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Cell VARCHAR(15),
    Joined_Date DATE DEFAULT CURRENT_DATE,
    Points INT DEFAULT 0
);
CREATE TABLE Roles (
    Role_Id INT PRIMARY KEY AUTO_INCREMENT,
    Role_Name ENUM('Specialist', 'IT Manager','Member') NOT NULL
);

CREATE TABLE Admin (
    Admin_Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Surname VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    Password VARCHAR(50) NOT NULL,
    Role_Id INT,
    Specialization ENUM('Biokineticist', 'Dietitian', 'Physiotherapist', 'IT Software Development'),
    FOREIGN KEY (Role_Id) REFERENCES Roles(Role_Id)
);

CREATE TABLE Appointments (
    Appointment_Id INT PRIMARY KEY AUTO_INCREMENT,
    Member_Id INT,
    Specialist_Id INT,
    Date DATE DEFAULT NULL,
    Status ENUM('Attended', 'Missed', 'Pending') NOT NULL,
    FOREIGN KEY (Member_Id) REFERENCES Members(Id_No),
    FOREIGN KEY (Specialist_Id) REFERENCES Admin(Admin_Id)
);

-- Insert roles
INSERT INTO Roles (Role_Name) VALUES ('Specialist'), ('IT Manager');

-- Insert data into Members table
INSERT INTO Members (Id_No, Email, Name, Cell, Joined_Date, Points) VALUES
(920811, 'kwenakomape2@gmail.com', 'Kwena', '27609442412', '2024-05-14', 125),
(920845, 'jane.doe@example.com', 'Jane', '27634364578', '2024-06-20', 100),
(920938, 'augustnhila@ssisa.com', 'August', '27729723179', '2024-06-20', 100);

-- Insert data into Admin table
INSERT INTO Admin (Name, Email, Password, Role_Id, Specialization) VALUES
('Marvin Jacobs', 'marvinjacobs@gmail.com', 'SSISA!', 1, 'Biokineticist'),
('Marie', 'marie@gmail.com', 'SSISA!', 1, 'Dietitian'),
('Rashaad', 'rashaad@gmail.com', 'SSISA!', 1, 'Physiotherapist'),
('Natasha', 'natasha@gmail.com', 'SSISA!', 1, 'Dietitian'),
('IT Manager', 'itmanager@example.com', 'SSISA!', 2, 'IT Software Development');

-- Insert data into Appointments table
INSERT INTO Appointments (Member_Id, Specialist_Id, Status) VALUES
(920811, 1, 'Attended'),
(920811, 2,'Missed'),
(920845, 1,'Pending'),
(920811, 3,'Pending'),
(920811, 1,'Pending');
UPDATE Appointments SET Date = null WHERE Member_Id = 920811;
UPDATE Appointments SET Date = null WHERE Member_Id = 920845;
SELECT * FROM Members;
SELECT * FROM Appointments;
SELECT * FROM Roles;
SELECT * FROM Admin;

SELECT 
    a.Appointment_Id,
    a.Date,
    a.Status,
    m.Id_No,
    m.Email,
    m.Name AS Member_Name,
    m.Cell,
    m.Joined_Date,
    m.Points,
    s.Name AS Specialist_Name,
    s.Specialization
FROM 
    Appointments a
JOIN 
    Members m ON a.Member_Id = m.Id_No
JOIN 
    Admin s ON a.Specialist_Id = s.Admin_Id
WHERE 
    m.Id_No = 920811;


SELECT 
    a.Appointment_Id,
    a.Member_Id,
    m.Name AS Member_Name,
    a.Date,
    a.Status,
    ad.Name AS Specialist_Name
FROM 
    Appointments a
JOIN 
    Members m ON a.Member_Id = m.Id_No
JOIN 
    Admin ad ON a.Specialist_Id = ad.Admin_Id
WHERE 
    a.Specialist_Id = 1;
UPDATE Members
SET Points = Points - 1
WHERE Id_No = 920811;


DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Specialists;
DROP TABLE IF EXISTS Members;
DROP TABLE IF EXISTS Admin;
DROP TABLE IF EXISTS Roles;
