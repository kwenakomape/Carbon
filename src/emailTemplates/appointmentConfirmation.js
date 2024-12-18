import dayjs from "dayjs";

export const generateAppointmentConfirmationHTML = (memberName, selectedSpecialist, selectedDates, timeRanges,specialistId) => {
  let appointmentDetailsHTML;

  if (specialistId === 2) {
    appointmentDetailsHTML = `<p class="appointment-date">Date: ${dayjs(selectedDates).format('YYYY-MM-DD')} | Time: ${dayjs(timeRanges.start).format('HH:mm')}</p>`;
  } else {
    appointmentDetailsHTML = selectedDates
      .map((date, index) => {
        const times = timeRanges[index];
        return `<p class="appointment-date">Day ${index + 1}: ${dayjs(date).format('YYYY-MM-DD')} | Time: From ${dayjs(times.start).format('HH:mm')} to ${dayjs(times.end).format('HH:mm')}</p>`;
      })
      .join('');
  }

  return `<!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; }
      .email-container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc; border-radius: 10px; }
      .email-header, .email-footer { text-align: center; margin-bottom: 20px; }
      .email-content { margin-bottom: 20px; }
      .appointment-details { margin-bottom: 20px; }
      .appointment-date { font-weight: bold; color: #333; }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <h2>Your SSISA Carbon Team</h2>
      </div>
      <div class="email-content">
        <p>You have a new appointment request with the following details:</p>
        <p>Client Name: <strong>${memberName}</strong></p>
        <p>Specialist: <strong>${selectedSpecialist}</strong></p>
      </div>
      <div class="appointment-details">
        ${appointmentDetailsHTML}
      </div>
      <div class="email-content">
        <p>Please ensure that all necessary preparations are made for ${memberName}'s appointment. To confirm and schedule the appointment,
          please log into the site using your admin credentials at the following link:</p>
        <p><a href="http://your-health-clinic-admin-portal-link">carbon@ssisa.com</a></p>
        <p>If there are any questions or changes needed, please contact ${memberName} directly.</p>
      </div>
      <div class="email-footer">
        <p>Thank you,<br>Your SSISA Carbon Team</p>
      </div>
    </div>
  </body>
  </html>`;
};