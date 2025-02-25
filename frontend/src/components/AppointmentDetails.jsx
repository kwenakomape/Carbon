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
  specialistId
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
      {specialistId !== 2 && specialistId !==4 && (
        <>
          <p className="text-lg mt-2 mb-2">
            <strong>Selected Dates/Times:</strong>
          </p>
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
