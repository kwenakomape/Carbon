CREATE TABLE Members (
    Id_No INT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    Cell VARCHAR(15),
    Joined_Date DATE,
    Points INT DEFAULT 0
);

CREATE TABLE Specialists (
    Specialist_Id INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(255) NOT NULL,
    Type ENUM('Biokineticist', 'Dietitian','Physiotherapist', 'Other') NOT NULL
);

CREATE TABLE Appointments (
    Appointment_Id INT PRIMARY KEY AUTO_INCREMENT,
    Member_Id INT,
    Specialist_Id INT,
    Date DATE DEFAULT NULL,
    Status ENUM('Attended', 'Missed', 'Pending') NOT NULL,
    FOREIGN KEY (Member_Id) REFERENCES Members(Id_No),
    FOREIGN KEY (Specialist_Id) REFERENCES Specialists(Specialist_Id)
);

-- Insert data into Members table
INSERT INTO Members (Id_No, Email,Name, Cell, Joined_Date, Points) VALUES
(920811, 'august.bhila@example.com','kwena', '27609442412', '2024-05-14', 125),
(920845, 'jane.doe@example.com','Jane', '27634364578', '2024-06-20', 100),
(920938, 'augustnhila@ssisa.com','August', '27729723179', '2024-06-20', 100);

-- Insert data into Specialists table
INSERT INTO Specialists (Name, Type) VALUES
('Brain', 'Biokineticist'),
('Natasha', 'Dietitian'),
('Marie', 'Dietitian'),
('Jade', 'Physiotherapist');

-- Insert data into Appointments table
INSERT INTO Appointments (Member_Id, Specialist_Id, Date, Status) VALUES
(920811, 1, '2024-12-24', 'Attended'),
(920811, 2, '2024-11-14', 'Missed'),
(920845, 1, '2024-11-16', 'Pending'),
(920811, 3, '2024-12-01', 'Pending'),
(920811, 1, '2024-12-01', 'Pending');

SELECT * FROM Members;
SELECT * FROM Appointments;
SELECT * FROM Specialists;

DROP TABLE IF EXISTS Appointments;
DROP TABLE IF EXISTS Specialists;
DROP TABLE IF EXISTS Members;
