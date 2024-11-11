import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import { Infobip, AuthType } from "@infobip-api/sdk";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { da } from "date-fns/locale";
const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "carbondb",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database");
});

const infobipClient = new Infobip({
  baseUrl: "rp351y.api.infobip.com",
  apiKey:
    "4ef7b1a013e03cddf64daa67f82c15e5-f8dc5622-83e5-4578-bf50-26e64ebc1366",
  authType: AuthType.ApiKey,
});

const otpStore = new Map(); // Store OTPs temporarily

// Generate a random OTP
function generateOtp() {
  return crypto.randomInt(1000, 9999).toString();
}

// Send OTP to user's phone number
async function sendOtp(phoneNumber) {
  const otp = generateOtp();
  otpStore.set(phoneNumber, otp);

  try {
    const response = await infobipClient.channels.sms.send({
      type: "text",
      messages: [
        {
          destinations: [{ to: phoneNumber }],
          from: "YourSenderID",
          text: `Your OTP code is ${otp}`,
        },
      ],
    });
    console.log("OTP sent:", response.data);
    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
}

// Verify OTP
function verifyOtp(phoneNumber, otp) {
  const storedOtp = otpStore.get(phoneNumber);
  if (storedOtp === otp) {
    otpStore.delete(phoneNumber); // Remove OTP after verification
    return true;
  }
  return false;
}

app.post("/check-username", (req, res) => {
  const { username } = req.body;

  const checkEmailQuery = "SELECT * FROM Admin WHERE Username = ?";
  const checkIDQuery = "SELECT * FROM Members WHERE Id_No = ?";

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    db.query(checkEmailQuery, [username], (err, results) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      res.send({
        exists: results.length > 0,
        type: "email",
        erroMessage: "Username does not exist",
      });
    });
  } else if (/^\d+$/.test(username)) {
    db.query(checkIDQuery, [username], (err, results) => {
      if (err) {
        return res.status(500).send("Database error");
      }
      if (results.length > 0) {
        const { Cell, } = results[0];
        // const { Cell } = results[0];
        res.send({
          exists: true,
          type: "id",
          Cell: Cell,
          erroMessage: "Username does not exist",
        });
      } else {
        res.send({
          exists: false,
          type: "id",
          erroMessage: "Username does not exist",
        });
      }
    });
  } else if (username === "") {
    res.send({
      exists: false,
      type: "invalid",
      erroMessage: "Field Empty,Please Enter Username",
    });
  } else {
    res.send({
      exists: false,
      type: "invalid",
      erroMessage: "Username does not exist",
    });
  }
});

app.post("/send-otp", async (req, res) => {
  const { Cell } = req.body;
  const phoneNumber = Cell; // Assuming username is the phone number
  const success = await sendOtp(phoneNumber);
  if (success) {
    res.status(200).send("OTP sent successfully");
  } else {
    res.status(500).send("Failed to send OTP");
  }
});

app.post("/verify-otp", (req, res) => {
  const { Cell, otp } = req.body;
  const phoneNumber = Cell; // Assuming username is the phone number
  const isValid = verifyOtp(phoneNumber, otp);
  if (isValid) {
    res.status(200).send({ valid: true });
  } else {
    res.status(400).send({ valid: false });
  }
});

app.listen(3001, () => {
  console.log("Database server running on port 3001..");
});

app.post("/verify-password", (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT Password FROM Admin WHERE Username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (results.length > 0) {
      const storedPassword = results[0].Password;
      if (storedPassword === password) {
        res.send({ valid: true });
      } else {
        if(password===""){
          res.send({ valid: false ,errorMessage: "Field Empty,Please Enter Password"});
        }else{
          res.send({ valid: false ,errorMessage: "Invalid Password"});
        }
        
      }
    }
  });
});
app.get("/member/:id", (req, res) => {
  const memberId = req.params.id;
  const query = `
  SELECT m.Id_No, m.Email, m.Name, m.Cell, m.Joined_Date, m.Points, 
         IFNULL(a.Date, '___________') AS Date, a.Status, s.Name AS Specialist, s.Type 
  FROM Members m
  LEFT JOIN Appointments a ON m.Id_No = a.Member_Id
  LEFT JOIN Specialists s ON a.Specialist_Id = s.Specialist_Id
  WHERE m.Id_No = ?`;

  db.query(query, [memberId], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.send(results);
  });
});

app.post("/api/bookings", (req, res) => {
  const { memberId, specialistId, date, status } = req.body;
  const query =
    "INSERT INTO Appointments (Member_Id, Specialist_Id, Date, Status) VALUES (?, ?, ?, ?)";
  db.query(query, [memberId, specialistId, date, status], (err, results) => {
    if (err) {
      console.error("Error inserting appointment:", err);
      res.status(500).send("Error booking appointment");
      return;
    }
    res.status(200).send("Appointment booked successfully");
  });
});

app.post("/api/send-email", (req, res) => {
  const { memberName, selectedSpecialist, date, selectedDietitian,time } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "kwenakomape2@gmail.com",
        pass: "kugt ckvd bbum donl",
      },
    });

    const mailOptions = {
      from: "kwenakomape2@gmail.com",
      to: "kwenakomape3@gmail.com",
      subject: "New Appointment Scheduled: Jane",
      text: `Dear ${selectedDietitian},

          You have a new appointment scheduled with the following details:
            - **Client Name**: **${memberName}**
            - **Speciality**: **${selectedSpecialist}**
            - **Date**: **${date}**
            - **Time**: **${time}**
          Please ensure that all necessary preparations are made for Jane's appointment. If there are any questions or changes needed, please contact Jane directly.
          To approve and attend the appointment, please log into the carbon site using your admin credentials at the following link:
          http://localhost:5173/dashboard/user/920845

          Thank you,
          Your SSISA CARBON TEAM`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent:", info.response);
        res.status(200).send("Email sent successfully");
      }
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).send("Error sending email");
  }
});

