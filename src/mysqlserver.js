import express from "express";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import { Infobip, AuthType } from "@infobip-api/sdk";
import crypto from "crypto";
import nodemailer from "nodemailer";
import dayjs from "dayjs";
// import { da } from "date-fns/locale";
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
  baseUrl: "xk94el.api.infobip.com",
  apiKey:
    "abc09110b918bb66712f677c79f107c4-a44701bc-b6f9-40f8-8dc2-db651143b080",
  authType: AuthType.ApiKey,
});

const otpStore = new Map(); // Store OTPs temporarily

// Generate a random OTP
function generateOtp() {
  return crypto.randomInt(1000, 9999).toString();
}

async function sendAppointmentMessage(phoneNumber, message) {

  return await sendSms(phoneNumber, message);
}
async function sendOtp(phoneNumber) {
  const otp = generateOtp();
  otpStore.set(phoneNumber, otp);
  const message = `Your OTP code is ${otp}`;
  return await sendSms(phoneNumber, message);
}
async function sendSms(phoneNumber, message) {
  try {
    const response = await infobipClient.channels.sms.send({
      type: "text",
      messages: [
        {
          destinations: [{ to: phoneNumber }],
          from: "YourSenderID",
          text: message,
        },
      ],
    });
    console.log("SMS sent:", response.data);
    return true;
  } catch (error) {
    console.error("Error sending SMS:", error);
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

  const checkEmailQuery = "SELECT * FROM Admin WHERE Email = ?";
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
        const { Cell } = results[0];
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
  const query = "SELECT * FROM Admin WHERE Email = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (results.length > 0) {
      const storedPassword = results[0].Password;
      let AdminID = results[0].Admin_Id;
      if (storedPassword === password) {
        res.send({ valid: true, AdminID: AdminID });
      } else {
        if (password === "") {
          res.send({
            valid: false,
            errorMessage: "Field Empty,Please Enter Password",
          });
        } else {
          res.send({ valid: false, errorMessage: "Invalid Password" });
        }
      }
    }
  });
});
app.get("/member/:id", (req, res) => {
  const memberId = req.params.id;
  const query = `
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
            m.Id_No = ?`;

  db.query(query, [memberId], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.send(results);
  });
});
app.get("/api/appointments-with-specialist/:id", (req, res) => {
  const adminId = req.params.id;
  const query = `
          SELECT 
              a.Appointment_Id,
              a.Member_Id,
              m.Name AS Member_Name,
              m.Cell,
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
              a.Specialist_Id = ?`;

  db.query(query, [adminId], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.send(results);
  });
});

app.get("/api/paywith-credits", (req, res) => {
  const memberId = req.params.id;
  console.log(memberId, " thos api passed");
  const query = `UPDATE Members
            SET Points = Points - 1
       WHERE Id_No = ?`;

  db.query(query, [memberId], (err, results) => {
    if (err) {
      return res.status(500).send("Error updating points");
    }
    res.send(`Points updated successfully for memberId`);
  });
});
app.post("/api/send-appointment-details", async (req, res) => {

  const { phoneNumber,selectedDate,timeRange,memberName } = req.body;
  const confirmedDate = dayjs(selectedDate).format('MMMM D, YYYY');
  // const phoneNumber = Cell; // Assuming username is the phone number
  const message =`Dear ${memberName}, your appointment with the BIOKINETICIST is confirmed:
Date: ${confirmedDate}
Time: ${dayjs(timeRange.start).format("HH:mm")} - ${dayjs(timeRange.end).format("HH:mm")}
Please arrive early for paperwork. Thanks!
`

  const success = await sendAppointmentMessage(phoneNumber,message);
  if (success) {
    res.status(200).send("appointment message sent successfully");
  } else {
    res.status(500).send("Failed to send appointment message");
  }
});
app.post("/api/confirm-date", (req, res) => {

  const { memberId,selectedDate,AppointmentId,timeRange } = req.body;
  
  const confirmedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const query = `UPDATE Appointments SET Date = ?, Status = 'Confirmed' WHERE Member_Id = ? AND Appointment_Id = ?`
  
  
  db.query(query, [confirmedDate, memberId,AppointmentId], (err, results) => {
    if (err) {
      return res.status(500).send("Error updating points");
    }
    res.send(`Date Updated by the Specialist`);
  });
});
app.post("/api/update-appointment-status", (req, res) => {

  const { newStatus,memberId,AppointmentId} = req.body;

  const query = `UPDATE Appointments SET Status = ? WHERE Member_Id = ? AND Appointment_Id = ?`;
  
  db.query(query, [newStatus, memberId, AppointmentId], (err, results) => {
    if (err) {
      return res.status(500).send("Error updating Status");
    }
    res.send(`Status Updated Successfully`);
  });
});
app.post("/api/bookings", (req, res) => {
  const { memberId, specialistId, status } = req.body;
  const query =
    "INSERT INTO Appointments (Member_Id, Specialist_Id, Status) VALUES (?, ?, ?)";
  db.query(query, [memberId, specialistId, status], (err, results) => {
    if (err) {
      console.error("Error inserting appointment:", err);
      res.status(500).send("Error booking appointment");
      return;
    }
    res.status(200).send("Appointment booked successfully");
  });
});

app.post("/api/send-email", (req, res) => {
  let {
    memberName,
    selectedSpecialist,
    specialistName,
    selectedDates,
    timeRanges,
  } = req.body;
  
  if (!specialistName) {
    specialistName = "Marvin";
  }
  
  const appointmentDetailsHTML = selectedDates
    .map((date, index) => {
      const times = timeRanges[index];
      return `<p class="appointment-date">Day ${index + 1}: ${dayjs(date).format(
        "YYYY-MM-DD"
      )} | Time: From ${dayjs(times.start).format("HH:mm")} to ${dayjs(times.end).format(
        "HH:mm"
      )}</p>`;
    })
    .join("");

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
      subject: `New Appointment Scheduled: ${memberName}`,
      html: `<!DOCTYPE html> <html> <head> <style> body { font-family: Arial, sans-serif; } 
      .email-container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; } 
      .email-header, .email-footer { text-align: center; margin-bottom: 20px; } .email-content { margin-bottom: 20px; } 
      .appointment-details { margin-bottom: 20px; } .appointment-date { font-weight: bold; color: #333; } </style> </head> 
      <body> <div class="email-container"> <div class="email-header"> 
      <h2>Your SSISA Carbon Team</h2> </div> <div class="email-content">
       <p>You have a new appointment scheduled with the following details:</p> 
       <p>Client Name: <strong>${memberName}</strong></p> 
       <p>Specialist: <strong>${selectedSpecialist}</strong></p> 
       </div> <div class="appointment-details"> 
           ${appointmentDetailsHTML}
      </div> <div class="email-content"> 
      <p>Please ensure that all necessary preparations are made for ${memberName}'s appointment. To approve and attend the appointment,
       please log into the site using your admin credentials at the following link:</p> 
       <p><a href="http://your-health-clinic-admin-portal-link">carbon@ssisa.com</a></p> 
       <p>If there are any questions or changes needed, please contact ${memberName} directly.</p> </div> <div class="email-footer"> 
       <p>Thank you,<br>Your SSISA Carbon Team</p> </div> </div> </body> </html> `,
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
