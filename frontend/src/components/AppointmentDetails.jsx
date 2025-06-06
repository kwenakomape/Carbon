export const AppointmentDetails = ({
  clientName,
  phoneNumber,
  memberEmail,
  appointmentId,
  confirmed_date,
  confirmed_time,
  credits_used,
  appointmentStatus,
  preferred_date1,
  preferred_time_range1,
  preferred_date2,
  preferred_time_range2,
  preferred_date3,
  preferred_time_range3,
  specialistId,
  specialistName,
  notes_status,
  booking_type,
  booked_by,
  roleId,
}) => {
  return (
    <div className="appointment-details">
      <p>
        <strong>Name:</strong> {clientName}
      </p>
      <p>
        <strong>Phone Number:</strong> {phoneNumber}
      </p>
      <p>
        <strong>Email:</strong> {memberEmail}
      </p>
      <p>
        <strong>Appointment ID:</strong> {appointmentId}
      </p>
      <p>
        <strong>Confirmed Date:</strong> {confirmed_date}
      </p>
      <p>
        <strong>Confirmed Time:</strong> {confirmed_time}
      </p>
      <p>
        <strong>Credits Used:</strong> {credits_used}
      </p>
      <p>
        <strong>Appointment Status:</strong> {appointmentStatus}
      </p>
      <p>
        <strong>Booking Type:</strong> {booking_type}
      </p>
      {booking_type === "Referral" && (
        <>
          <p>
            <strong>Booked By:</strong> {booked_by}
          </p>
          <p>
            <strong>Referred By:</strong> {booked_by}
          </p>
        </>
      )}
      {booking_type === "Standard" && roleId === 3 && (
        <p>
          <strong>Booked By:</strong> Self
        </p>
      )}
      {booking_type === "Standard" && roleId === 1 && (
        <p>
          <strong>Booked By:</strong> {booked_by} (Client)
        </p>
      )}

      {appointmentStatus === "Confirmed" && (
        <p>
          <strong>Appointment Assigned To:</strong> {specialistName}
        </p>
      )}
      {appointmentStatus === "Seen" && (
        <>
          <p>
            <strong>Appointment Completed By:</strong> {specialistName}
          </p>
        </>
      )}

      {specialistId !== 2 && specialistId !== 4 && (
        <>
          {roleId === 1 && (
            <p className="text-lg mt-2 mb-2">
              <strong>Proposed Dates/Times By Client:</strong>
            </p>
          )}
          {roleId === 3 && (
            <p className="text-lg mt-2 mb-2">
              <strong>Your Proposed Dates/Times:</strong>
            </p>
          )}
          <p>
            <strong>Date 1:</strong> {preferred_date1}, From{" "}
            {preferred_time_range1}
          </p>
          <p>
            <strong>Date 2:</strong> {preferred_date2}, From{" "}
            {preferred_time_range2}
          </p>
          <p>
            <strong>Date 3:</strong> {preferred_date3}, From{" "}
            {preferred_time_range3}
          </p>
        </>
      )}
    </div>
  );
};
