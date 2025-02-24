
export const AppointmentDetails = (clientName,phoneNumber,memberEmail,appointmentId,confirmed_date,confirmed_time,credits_used,appointmentStatus) => {
    return (

        <div className="appointment-details">
            <p>
              <strong>Client Name:</strong> {clientName}
            </p>
            <p>
              <strong>Phone Number:</strong> {phoneNumber}
            </p>
            <p>
              <strong>Email:</strong> {memberEmail}
            </p>
            <p>
              <strong>Appointment ID:</strong>{" "}
              {appointmentId}
            </p>
            <p>
              <strong>Confirmed Date:</strong>{" "}
              {confirmed_date}
            </p>
            <p>
              <strong>Confirmed Time:</strong>{" "}
              {confirmed_time}
            </p>
            <p>
              <strong>Credits Used:</strong>{" "}
              {credits_used}
            </p>
            <p>
              <strong>Appointment Status:</strong>{" "}
              {appointmentStatus}
            </p>

            {/* Add other details here */}
          </div>
    )

}