import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import cors from "cors";
import dayjs from "dayjs";
import { sendEmail } from "./utils/emailSender.js";
import { generateAppointmentConfirmationHTML } from "./emailTemplates/appointmentConfirmation.js";
import { generateInvoiceEmailHTML } from "./emailTemplates/invoiceEmail.js";
import { fileURLToPath } from "url";
import path from "path";
import pool from "./config/db.js"; // Ensure this exports a promise-based pool
import authRouter from './routes/authRoutes.js';
import morgan from 'morgan';

const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.static(path.join(__dirname, "../../frontend/dist")));
app.use(express.json());
app.use(morgan('combined', { stream: logger.stream }));
// Routes
app.use('/api/auth', authRouter);

// Health check endpoint
// This is commonly known as a health check endpoint. 
// It's used to verify that your server or application is running and responsive—often 
// used in monitoring systems, load balancers, or deployment pipelines.

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
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
      Appointments.booking_type,
      Appointments.notes_status,
      Appointments.booked_by,
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
      a.booking_type,
      a.booked_by,
      a.notes_status,
      ad.name as admin_name,
      ad.role_id,
      ad.specialist_type,
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

app.post("/api/update-notes-status", async (req, res) => {
  const { notes_status, memberId, AppointmentId } = req.body;
  let query = `UPDATE Appointments SET notes_status = ? WHERE member_id = ? AND appointment_id = ?`;
  let params = [notes_status, memberId, AppointmentId];
  try {
    await pool.query(query, params);
    res.send(`Notes Status Updated Successfully`);
  } catch (err) {
    console.error("Error updating Notes status:", err);
    res.status(500).send("Error updating Notes status");
  }
});

// GET Notifications for user (member or specialist)
app.get("/api/notifications/:user_type/:id", async (req, res) => {
  const { id, user_type } = req.params;
  const idField = user_type === 'specialist' ? 'n.specialist_id' : 'n.member_id';

  const query = `
    SELECT 
      n.notification_id, 
      n.notification_type,
      n.initiated_by,
      n.timestamp, 
      n.read_status,
      n.seen_status,
      n.initiator_id,
      a.appointment_id, 
      a.member_id, 
      a.specialist_id, 
      a.status,
      m.name AS member_name,
      ad.name AS specialist_name,
      a.confirmed_date,
      a.confirmed_time,
      a.booking_type
    FROM Notifications n
    JOIN Appointments a ON n.appointment_id = a.appointment_id
    LEFT JOIN Members m ON a.member_id = m.member_id
    LEFT JOIN Admin ad ON a.specialist_id = ad.admin_id
    WHERE ${idField} = ?
      AND (
        -- For members, only show their referral notifications regardless of initiator
        (? = 'member' AND n.notification_type IN ('Referral Request Submitted', 'Referral Appointment Confirmed'))
        OR
        -- For specialists, only show their referral notifications regardless of initiator
        (? = 'specialist' AND n.notification_type IN ('New Referral Booking Request', 'New Referral Booking Confirmed'))
        OR
        -- For all other notifications, apply the standard filter
        (n.notification_type NOT IN ('Referral Request Submitted', 'Referral Appointment Confirmed', 'New Referral Booking Request', 'New Referral Booking Confirmed')
         AND (n.initiator_id IS NULL OR n.initiator_id != ?))
      )
    ORDER BY n.timestamp DESC
  `;

  try {
    const [notifications] = await pool.query(query, [id, user_type, user_type, id]);
    res.json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH Mark All Notifications as Seen
app.patch("/api/notifications/mark-all-seen/:user_type/:id", async (req, res) => {
  const { id, user_type } = req.params;
  const idField = user_type === 'specialist' ? 'specialist_id' : 'member_id';
  
  const query = `
    UPDATE Notifications
    SET seen_status = TRUE
    WHERE seen_status = FALSE
      AND ${idField} = ?
      /* Ensure we only update notifications meant for this user type */
      AND (
        (? = 'member' AND notification_type IN ('Referral Request Submitted', 'Referral Appointment Confirmed'))
        OR
        (? = 'specialist' AND notification_type IN ('New Referral Booking Request', 'New Referral Booking Confirmed'))
        OR
        notification_type NOT LIKE '%Referral%'
      )
  `;
  
  try {
    await pool.query(query, [id, user_type, user_type]);
    res.send(`All notifications marked as seen`);
  } catch (err) {
    console.error("Error marking notifications as seen:", err);
    res.status(500).send("Error marking notifications as seen");
  }
});

// PATCH Mark All Notifications as Read
app.patch("/api/notifications/mark-all-read/:user_type/:id", async (req, res) => {
  const { id, user_type } = req.params;
  const idField = user_type === 'specialist' ? 'specialist_id' : 'member_id';
  
  const query = `
    UPDATE Notifications
    SET read_status = TRUE
    WHERE read_status = FALSE
      AND ${idField} = ?
      /* Ensure we only update notifications meant for this user type */
      AND (
        (? = 'member' AND notification_type IN ('Referral Request Submitted', 'Referral Appointment Confirmed'))
        OR
        (? = 'specialist' AND notification_type IN ('New Referral Booking Request', 'New Referral Booking Confirmed'))
        OR
        notification_type NOT LIKE '%Referral%'
      )
  `;

  try {
    await pool.query(query, [id, user_type, user_type]);
    res.send(`All notifications marked as read`);
  } catch (err) {
    console.error("Error marking notifications as read:", err);
    res.status(500).send("Error marking notifications as read");
  }
});

// PATCH Mark Single Notification as Read
app.patch("/api/notifications/:notification_id/read/:user_type/:user_id", async (req, res) => {
  const { notification_id, user_type, user_id } = req.params;
  const idField = user_type === 'specialist' ? 'specialist_id' : 'member_id';
  
  const query = `
    UPDATE Notifications
    SET read_status = TRUE
    WHERE notification_id = ?
      AND ${idField} = ?
      /* Additional check to ensure we're updating the correct notification type */
      AND (
        (? = 'member' AND notification_type IN ('Referral Request Submitted', 'Referral Appointment Confirmed'))
        OR
        (? = 'specialist' AND notification_type IN ('New Referral Booking Request', 'New Referral Booking Confirmed'))
        OR
        notification_type NOT LIKE '%Referral%'
      )
  `;

  try {
    const [result] = await pool.query(query, [notification_id, user_id, user_type, user_type]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Notification not found or doesn't belong to this user type");
    }

    res.send("Notification marked as read");
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).send("Error marking notification as read");
  }
});

// POST Create Notification
app.post("/api/notifications", async (req, res) => {
  console.log(req.body);
  const { appointment_id, notification_type, recipient_type, recipient_id, initiated_by,member_id, initiator_id } = req.body;

  const query = `
    INSERT INTO Notifications (
      appointment_id,
      specialist_id,
      notification_type,
      member_id, 
      initiated_by,
      initiator_id
    ) VALUES (?, ?, ?, ?, ?,?)
  `;
  
  const params = [appointment_id, recipient_id, notification_type, member_id,initiated_by, initiator_id];

  try {
    await pool.query(query, params);
    res.send("Notification created successfully");
  } catch (err) {
    console.error("Error creating notification:", err);
    res.status(500).send("Error creating notification");
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
  const { memberId, selectedDate, appointmentId, timeRange, status,specialistName } = req.body;
  console.log(specialistName);
  const confirmedDate = dayjs(selectedDate).format("YYYY-MM-DD");
  const confirmedTime = `${dayjs(timeRange.start).format("HH:mm")}-${dayjs(
    timeRange.end
  ).format("HH:mm")}`;
  const updateAppointmentQuery = `UPDATE Appointments SET confirmed_date = ?, confirmed_time = ?, status = ?, specialist_name = ? WHERE member_id = ? AND appointment_id = ?`;
  const updateSessionQuery = `UPDATE Sessions SET date = ? WHERE appointment_id = ?`;

  try {
    await pool.query(updateAppointmentQuery, [
      confirmedDate,
      confirmedTime,
      status,
      specialistName,
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
    actionType,
    booking_type,
    notes_status,
    booked_by,
    initiator_id
  } = req.body;

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
        INSERT INTO Appointments (member_id, specialist_id, status, confirmed_date, confirmed_time,specialist_name,booking_type,notes_status,booked_by,initiator_id)
        VALUES (?, ?, ?, ?, ?,?,?,?,?,?)
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
              booking_type,
              notes_status,
              booked_by,
              initiator_id,
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
        INSERT INTO Appointments (member_id, specialist_id, status, preferred_date1, preferred_time_range1, preferred_date2, preferred_time_range2, preferred_date3, preferred_time_range3,booking_type,notes_status,booked_by,initiator_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?,?)
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
              booking_type,
              notes_status,
              booked_by,
              initiator_id,
            ];

      await pool.query(appointmentQuery, appointmentValues);
      res.status(200).send("Appointment booked successfully");
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
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
})
