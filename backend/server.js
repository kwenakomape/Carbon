import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import cors from "cors";
import { Infobip, AuthType } from "@infobip-api/sdk";
import crypto from "crypto";
import dayjs from "dayjs";
import { sendEmail } from "./utils/emailSender.js";
import { generateAppointmentConfirmationHTML } from "./emailTemplates/appointmentConfirmation.js";
import { generateInvoiceEmailHTML } from "./emailTemplates/invoiceEmail.js";
import { fileURLToPath } from "url";
import path from "path";
import fs, { stat } from 'fs';
import pool from "./config/db.js"; // Ensure this exports a promise-based pool

const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.json());

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

app.post("/api/check-username", async (req, res) => {
  const { username } = req.body;

  const checkEmailQuery = "SELECT * FROM Admin WHERE email = ?";
  const checkIDQuery = "SELECT * FROM Members WHERE member_id = ?";

  try {
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      const [results] = await pool.query(checkEmailQuery, [username]);
      res.send({
        exists: results.length > 0,
        type: "email",
        erroMessage: "Username does not exist",
      });
    } else if (/^\d+$/.test(username)) {
      const [results] = await pool.query(checkIDQuery, [username]);
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
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
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

app.post("/api/verify-password", async (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM Admin WHERE email = ?";
  try {
    const [results] = await pool.query(query, [username]);
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
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
  }
});

app.get("/api/member/:id", async (req, res) => {
  const memberId = req.params.id;
  const query = `
    SELECT 
      Members.member_id,
      Members.email,
      Members.name AS member_name,
      Members.cell,
      Members.joined_date,
      Members.credits,
      Members.role_id,
      Appointments.appointment_id,
      Appointments.request_date,
      Appointments.confirmed_date,
      Appointments.confirmed_time,
      Appointments.status,
      Appointments.credits_used,
      Appointments.specialist_id,
      Appointments.invoice_status,
      Appointments.payment_method,
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
      Members.member_id = ?
    ORDER BY 
      Members.member_id, Appointments.appointment_id`;

  try {
    const [results] = await pool.query(query, [memberId]);
    res.send(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
  }
});

app.get("/api/appointments-with-specialist/:id", async (req, res) => {
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
      a.payment_method,
      a.payment_status,
      a.invoice_status,
      a.specialist_name,
      a.credits_used,
      a.preferred_date1,
      a.preferred_time_range1,
      a.preferred_date2,
      a.preferred_time_range2,
      a.preferred_date3,
      a.preferred_time_range3,
      ad.name as admin_name,
      ad.role_id,
      ad.admin_id AS specialist_id
    FROM 
      Admin ad
    LEFT JOIN 
      Appointments a ON ad.admin_id = a.specialist_id
    LEFT JOIN 
      Members m ON a.member_id = m.member_id
    LEFT JOIN 
      Sessions s ON a.appointment_id = s.appointment_id
    WHERE 
      ad.admin_id = ?
    GROUP BY 
      a.appointment_id,
      a.member_id,
      m.name,
      m.cell,
      a.payment_method,
      a.payment_status,
      a.invoice_status,
      a.credits_used,
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
      ad.name
    ORDER BY 
      a.appointment_id`;

  try {
    const [results] = await pool.query(query, [adminId]);
    res.send(results);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).send("Database error");
  }
});
app.post('/api/upload-invoice', upload.single('file'), async (req, res) => {
  const { memberId, appointmentId} = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  // Convert the file buffer to a BLOB
  const fileBlob = file.buffer;

  // Update the database with the new file path and status
  const updateQuery = `UPDATE Appointments 
       SET invoice_file = ?, invoice_status = ?
       WHERE member_id = ? AND appointment_id = ?`;
  try {
    await pool.query(updateQuery, [fileBlob,'INVOICE_UPLOADED',memberId,appointmentId]);
    res.json({ success: true, message: 'Invoice uploaded successfully.' });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({ success: false, message: 'Failed to update appointment.' });
  }
});

app.post("/api/update-appointment-status", async (req, res) => {
  const { newStatus, memberId, AppointmentId,paymentMethod } = req.body;
  let query;
  let params;
  console.log(req.body)

  // Check if the new status is "SEEN"
  if (newStatus === "SEEN") {
    // Update both status and payment_method
    if(paymentMethod!=='DEFERRED'){
      query = `UPDATE Appointments SET status = ?, payment_method = ?, payment_status = ? WHERE member_id = ? AND appointment_id = ?`;
      params = [newStatus,paymentMethod ,'PAID', memberId, AppointmentId]
    }else{
      query = `UPDATE Appointments SET status = ?, payment_method = ? WHERE member_id = ? AND appointment_id = ?`;
      params = [newStatus,paymentMethod , memberId, AppointmentId];
    }
  } else {
    // Update only the status
    query = `UPDATE Appointments SET status = ? WHERE member_id = ? AND appointment_id = ?`;
    params = [newStatus, memberId, AppointmentId];
  }

  try {
    await pool.query(query, params);
    res.send(`Status Updated Successfully`);
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).send("Error updating status");
  }
});
app.get("/api/paywith-credits/:id", async (req, res) => {
  const memberId = req.params.id;
  const updateQuery = `UPDATE Members SET credits = credits - 80 WHERE member_id = ?`;
  const selectQuery = `SELECT credits FROM Members WHERE member_id = ?`;

  try {
    await pool.query(updateQuery, [memberId]);
    const [results] = await pool.query(selectQuery, [memberId]);
    res.send(results);
  } catch (err) {
    console.error("Error updating credits:", err);
    res.status(500).send("Error updating credits");
  }
});

app.post("/api/send-appointment-details", async (req, res) => {
  const { phoneNumber, selectedDate, timeRange, memberName } = req.body;
  const confirmedDate = dayjs(selectedDate).format("MMMM D, YYYY");
  const message = `Dear ${memberName}, your appointment with the BIOKINETICIST is confirmed:
    Date: ${confirmedDate}
    Time: ${dayjs(timeRange.start).format("HH:mm")} - ${dayjs(
    timeRange.end
  ).format("HH:mm")}
    Please arrive early for paperwork. Thanks!`;

  const success = await sendAppointmentMessage(phoneNumber, message);
  if (success) {
    res.status(200).send("Appointment message sent successfully");
  } else {
    res.status(500).send("Failed to send appointment message");
  }
});

app.post("/api/confirm-date", async (req, res) => {
  const { memberId, selectedDate, appointmentId, timeRange, status } = req.body;
  const confirmedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const confirmedTime = `${dayjs(timeRange.start).format("HH:mm")}-${dayjs(
    timeRange.end
  ).format("HH:mm")}`;
  const updateAppointmentQuery = `UPDATE Appointments SET confirmed_date = ?, confirmed_time = ?, status = ? WHERE member_id = ? AND appointment_id = ?`;
  const updateSessionQuery = `UPDATE Sessions SET date = ? WHERE appointment_id = ?`;

  try {
    await pool.query(updateAppointmentQuery, [
      confirmedDate,
      confirmedTime,
      status,
      memberId,
      appointmentId,
    ]);
    await pool.query(updateSessionQuery, [confirmedDate, appointmentId]);
    res.send("Date updated by the specialist");
  } catch (err) {
    console.error("Error updating appointment:", err);
    res.status(500).send("Error updating appointment");
  }
});



app.post("/api/bookings", async (req, res) => {
  const {
    memberId,
    specialistId,
    status,
    selectedDates,
    timeRanges,
    timeRange,
    selectedDate,
    appointmentId,
    specialistName,
    actionType
  } = req.body;
   console.log(status);
   console.log(actionType);
  const formatDateTime = (date, timeRange) => ({
    date: dayjs(date).format("YYYY-MM-DD"),
    timeRange: `${dayjs(timeRange.start).format("HH:mm")} to ${dayjs(
      timeRange.end
    ).format("HH:mm")}`,
  });

  try {
    if (specialistId === 2 || specialistId==4) {
      const appointmentQuery =
      actionType === "Reschedule"
          ? `
        UPDATE Appointments
        SET confirmed_date = ?, confirmed_time = ?
        WHERE appointment_id = ? AND member_id = ?
      `
          : `
        INSERT INTO Appointments (member_id, specialist_id, status, confirmed_date, confirmed_time,specialist_name)
        VALUES (?, ?, ?, ?, ?,?)
      `;
      const appointmentValues =
      actionType === "Reschedule"
          ? [
              dayjs(selectedDate).format("YYYY-MM-DD"),
              `${dayjs(timeRange.start).format("HH:mm")}`,
              appointmentId,
              memberId,
            ]
          : [
              memberId,
              specialistId,
              "confirmed",
              dayjs(selectedDate).format("YYYY-MM-DD"),
              `${dayjs(timeRange.start).format("HH:mm")}`,
              specialistName,
            ];

      await pool.query(appointmentQuery, appointmentValues);
      res.status(200).send("Appointment booked successfully");
    } else {
      const preferredTimes = selectedDates.map((date, index) =>
        formatDateTime(date, timeRanges[index])
      );
      const appointmentQuery =
        actionType === "Reschedule" || actionType === "Modify"
          ? `
        UPDATE Appointments
        SET status = ? , preferred_date1 = ?, preferred_time_range1 = ?, preferred_date2 = ?, preferred_time_range2 = ?, preferred_date3 = ?, preferred_time_range3 = ?,confirmed_date = NULL, confirmed_time = NULL
        WHERE appointment_id = ? AND member_id = ?
      `
          : `
        INSERT INTO Appointments (member_id, specialist_id, status, preferred_date1, preferred_time_range1, preferred_date2, preferred_time_range2, preferred_date3, preferred_time_range3)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const appointmentValues =
        actionType === "Reschedule" || actionType === "Modify"
          ? [
              status,
              preferredTimes[0].date,
              preferredTimes[0].timeRange,
              preferredTimes[1].date,
              preferredTimes[1].timeRange,
              preferredTimes[2].date,
              preferredTimes[2].timeRange,
              appointmentId,
              memberId,
            ]
          : [
              memberId,
              specialistId,
              status,
              preferredTimes[0].date,
              preferredTimes[0].timeRange,
              preferredTimes[1].date,
              preferredTimes[1].timeRange,
              preferredTimes[2].date,
              preferredTimes[2].timeRange,
            ];

      await pool.query(appointmentQuery, appointmentValues);
      res.status(200).send("Appointment and sessions booked successfully");
    }
  } catch (err) {
    console.error("Error booking appointment:", err);
    res.status(500).send("Error booking appointment");
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
    actionType,
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
          specialistId,
          actionType
        ),
      };
      break;
    case "invoiceEmail":
      mailOptions = {
        from: "kwenakomape3@gmail.com",
        to: "kwenakomape2@gmail.com,kwenakomape3@gmail.com",
        subject: invoiceDetails[0].invoice_number,
        html: generateInvoiceEmailHTML(
          invoiceDetails,
          paymentMethod,
          remainingCredits
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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  console.log("Server running on port 3001..");
});
