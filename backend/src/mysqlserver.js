import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import multer from "multer";
import mysql from "mysql2";
import bodyParser from "body-parser";
import cors from "cors";
import { Infobip, AuthType } from "@infobip-api/sdk";
import crypto from "crypto";
import dayjs from "dayjs";
import {sendEmail} from '../utils/emailSender.js';
import {generateAppointmentConfirmationHTML} from "./emailTemplates/appointmentConfirmation.js";
import {generateInvoiceEmailHTML} from "./emailTemplates/invoiceEmail.js";
import { fileURLToPath } from 'url';
import path from 'path';

const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const port =3001;
app.use(cors());
// Serve static files from the dist folderdss
// app.use(express.static(path.join(__dirname, '../')));
app.use(express.static(path.join(__dirname, '../../frontend/dist')));


app.use(bodyParser.json());
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
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

app.post("/api/check-username", (req, res) => {
  const { username } = req.body;

  const checkEmailQuery = "SELECT * FROM Admin WHERE email = ?";
  const checkIDQuery = "SELECT * FROM Members WHERE member_id = ?";

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
        const { cell } = results[0];
        res.send({
          exists: true,
          type: "id",
          Cell: cell,
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


app.post("/api/send-otp", async (req, res) => {
  const { Cell } = req.body;
  const phoneNumber = Cell; // Assuming username is the phone number
  const success = await sendOtp(phoneNumber);
  if (success) {
    res.status(200).send("OTP sent successfully");
  } else {
    res.status(500).send("Failed to send OTP");
  }
});

app.post("/api/verify-otp", (req, res) => {
  const { Cell, otp } = req.body;
  const phoneNumber = Cell; // Assuming username is the phone number
  const isValid = verifyOtp(phoneNumber, otp);
  if (isValid) {
    res.status(200).send({ valid: true });
  } else {
    res.status(400).send({ valid: false });
  }
});



app.post("api/verify-password", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM Admin WHERE email = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    if (results.length > 0) {
      const storedPassword = results[0].password;
      let AdminID = results[0].admin_id;
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
app.get("/api/member/:id", (req, res) => {
  const memberId = req.params.id;
  const query = `
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
    Appointments.specialist_id,
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
    Members.member_id = ?
ORDER BY 
    Members.member_id, Appointments.appointment_id`;

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
    a.appointment_id,
    a.member_id,
    m.name AS member_name,
    m.cell,
    m.credits,
    m.email,
    a.request_date,
    a.confirmed_date,
    a.confirmed_time,
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
    i.invoice_status,  -- Added invoice status
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
    ad.admin_id = ?
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
    i.payment_method,
    i.invoice_status  -- Added invoice status to GROUP BY
ORDER BY 
    a.appointment_id`;

  db.query(query, [adminId], (err, results) => {
    if (err) {
      return res.status(500).send("Database error");
    }
    res.send(results);
  });
});
app.post('/api/upload-invoice', upload.single('file'), (req, res) => {
  const { member_id, appointment_id, total_credits_used, total_amount, payment_method } = req.body;
  const pdfData = req.file.buffer;
  
  db.query('SELECT invoice_id, invoice_number FROM Invoices WHERE appointment_id = ?', [appointment_id], (err, results) => {
    if (err) {
      
      return res.status(500).send(err);
    }

    if (results.length > 0) {
      
      const existing_invoice_id = results[0].invoice_id;
      const existing_invoice_number = results[0].invoice_number;
      
      const updateQuery = `UPDATE Invoices SET member_id = ?, total_credits_used = ?, total_amount = ?, payment_method = ?, invoice_status = 'Invoice Uploaded' WHERE invoice_id = ?`;
      db.query(updateQuery, [member_id, total_credits_used, total_amount, payment_method, existing_invoice_id], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send(`Invoice updated successfully with number: ${existing_invoice_number}`);
      });
    } else {
      db.query('SELECT invoice_number FROM Invoices ORDER BY invoice_id DESC LIMIT 1', (err, results) => {
        if (err) {
          
          return res.status(500).send(err);
        }

        let last_invoice_number = results.length ? results[0].invoice_number : null;
        let new_invoice_number;
        const current_date = new Date().toISOString().slice(0, 10).replace(/-/g, '');

        if (last_invoice_number) {
          const last_number = parseInt(last_invoice_number.split('-')[2], 10);
          new_invoice_number = `INV-${current_date}-${String(last_number + 1).padStart(3, '0')}`;
        } else {
          new_invoice_number = `INV-${current_date}-001`;
        }

        const insertQuery = `INSERT INTO Invoices (invoice_number, member_id, appointment_id, total_credits_used, total_amount, payment_method, invoice_status) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        db.query(insertQuery, [new_invoice_number, member_id, appointment_id, total_credits_used, total_amount, payment_method,'Invoice Uploaded'], (err, result) => {
          if (err) {
            console.log(err);
            return res.status(500).send(err);
          }

          res.send(`Invoice added successfully with number: ${new_invoice_number}`);
        });
      });
    }
  });
});
app.get("/api/invoices/details/:id", (req, res) => {
  const appointmentId = req.params.id;
  
  const query = `
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
    i.appointment_id = ?;
  `;

  db.query(query, [appointmentId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Server error");
      return;
    }
    res.send(results);
  });
});

app.get("/api/paywith-credits/:id", (req, res) => {
  const memberId = req.params.id;
  const updateQuery = `UPDATE Members SET credits = credits - 80 WHERE member_id = ?`;
  const selectQuery = `SELECT credits FROM Members WHERE member_id = ?`;

  db.query(updateQuery, [memberId], (err, updateResults) => {
    if (err) {
      return res.status(500).send("Error updating points");
    }

    db.query(selectQuery, [memberId], (err, results) => {
      if (err) {
        return res.status(500).send("Error retrieving updated points");
      }
      
      
      res.send(results);
    });
  });
});

app.post("/api/send-appointment-details", async (req, res) => {

  const { phoneNumber,selectedDate,timeRange,memberName } = req.body;
  const confirmedDate = dayjs(selectedDate).format('MMMM D, YYYY');
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
  const { memberId, selectedDate, appointmentId,timeRange ,status} = req.body;
  const confirmedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const confirmedTime=`${dayjs(timeRange.start).format("HH:mm")}-${dayjs(timeRange.end).format("HH:mm")}`;
  const updateAppointmentQuery = `UPDATE Appointments SET confirmed_date = ?,confirmed_time =?, status = ? WHERE member_id = ? AND appointment_id = ?`;
  const updateSessionQuery = `UPDATE Sessions SET date = ? WHERE appointment_id = ?`;

  db.query(updateAppointmentQuery, [confirmedDate,confirmedTime,status, memberId, appointmentId], (err, results) => {
      if (err) {
          return res.status(500).send("Error updating appointment");
      }

      db.query(updateSessionQuery, [confirmedDate, appointmentId], (err, results) => {
          if (err) {
              return res.status(500).send("Error updating session date");
          }
          res.send("Date updated by the specialist");
      });
  });
});
app.post("/api/update-appointment-status", (req, res) => {

  const { newStatus,memberId,AppointmentId} = req.body;

  const query = `UPDATE Appointments SET status = ? WHERE member_id = ? AND appointment_id = ?`;
  
  db.query(query, [newStatus, memberId, AppointmentId], (err, results) => {
    if (err) {
      return res.status(500).send("Error updating Status");
    }
    res.send(`Status Updated Successfully`);
  });
});

// just prepopulate this data on the backend , we need an interface for member so select which services they are interested in
// or specialist choose which servives they offered them ,point is we need an interface to add sessions(services)

app.post("/api/bookings", (req, res) => {
  const { memberId, specialistId, status, selectedDates, timeRanges, timeRange, selectedDate, appointmentId } = req.body;
  const formatDateTime = (date, timeRange) => ({
    date: dayjs(date).format("YYYY-MM-DD"),
    timeRange: `${dayjs(timeRange.start).format('HH:mm')} to ${dayjs(timeRange.end).format('HH:mm')}`
  });

  if (specialistId === 2) {
    const appointmentQuery = status === "Rescheduled" ? `
      UPDATE Appointments
      SET status = ?, confirmed_date = ?, preferred_time_range1 = ?
      WHERE appointment_id = ? AND member_id = ?
    ` : `
      INSERT INTO Appointments (member_id, specialist_id, status, confirmed_date, preferred_time_range1)
      VALUES (?, ?, ?, ?, ?)
    `;
    const appointmentValues = status === "Rescheduled" ? [
      status, dayjs(selectedDate).format("YYYY-MM-DD"), `${dayjs(timeRange.start).format('HH:mm')}`,
      appointmentId, memberId
    ] : [
      memberId, specialistId, "confirmed",
      dayjs(selectedDate).format("YYYY-MM-DD"), `${dayjs(timeRange.start).format('HH:mm')}`
    ];

    db.query(appointmentQuery, appointmentValues, (err, results) => {
      if (err) {
        res.status(500).send("Error booking appointment");
        return;
      }
      res.status(200).send("Appointment booked successfully");
    });
  } else {
    const preferredTimes = selectedDates.map((date, index) => formatDateTime(date, timeRanges[index]));
    const appointmentQuery = status === "Rescheduled" ? `
      UPDATE Appointments
      SET status = ?, preferred_date1 = ?, preferred_time_range1 = ?, preferred_date2 = ?, preferred_time_range2 = ?, preferred_date3 = ?, preferred_time_range3 = ?
      WHERE appointment_id = ? AND member_id = ?
    ` : `
      INSERT INTO Appointments (member_id, specialist_id, status, preferred_date1, preferred_time_range1, preferred_date2, preferred_time_range2, preferred_date3, preferred_time_range3)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const appointmentValues = status === "Rescheduled" ? [
      status,
      preferredTimes[0].date, preferredTimes[0].timeRange,
      preferredTimes[1].date, preferredTimes[1].timeRange,
      preferredTimes[2].date, preferredTimes[2].timeRange,
      appointmentId, memberId
    ] : [
      memberId, specialistId, status,
      preferredTimes[0].date, preferredTimes[0].timeRange,
      preferredTimes[1].date, preferredTimes[1].timeRange,
      preferredTimes[2].date, preferredTimes[2].timeRange
    ];

    db.query(appointmentQuery, appointmentValues, (err, results) => {
      if (err) {
        res.status(500).send("Error booking appointment");
        return;
      }
      res.status(200).send("Appointment and sessions booked successfully");
    });
  }
});
app.post("/api/send-email", (req, res) => {
  const {
    type,
    memberName,
    specialistId,
    selectedSpecialist,
    selectedDates,
    timeRanges,
    selectedDate,
    timeRange,
    invoiceDetails,
    remainingCredits,
    paymentMethod,
    pdfEmailAttach,
  } = req.body;
  let mailOptions;
  switch (type) {
    case "appointmentConfirmation":
      mailOptions = {
        from: "kwenakomape3@gmail.com",
        to: "kwenakomape2@gmail.com,kwenakomape3@gmail.com",
        subject: `New Appointment Scheduled: ${memberName}`,
        html: generateAppointmentConfirmationHTML(
          memberName,
          selectedSpecialist,
          specialistId === 2 ? selectedDate : selectedDates,
          specialistId === 2 ? timeRange : timeRanges,
          specialistId
        ),
      };
      break;
    case "invoiceEmail":
      mailOptions = {
        from: "kwenakomape3@gmail.com",
        to: 'kwenakomape2@gmail.com,kwenakomape3@gmail.com',
        subject: invoiceDetails[0].invoice_number,
        html: generateInvoiceEmailHTML(
          invoiceDetails,
          paymentMethod,
          remainingCredits,
        ),
        attachments: [
          {
            filename: `${invoiceDetails[0].invoice_number}.pdf`,
            content: pdfEmailAttach.split("base64,")[1],
            encoding: "base64",
          },
        ],
      };
      break;
    default:
      res.status(400).send("Invalid email type");
      return;
  }
  sendEmail(mailOptions, res);
});

// Serve React app in production
// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
//   });
// }
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'));
});
app.listen(port, () => {
  console.log("Server running on port 3001..");
});