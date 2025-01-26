import axios from "axios";
export const updateAppointmentStatus = async (id, appointmentId, status) => {
    let data = {
      memberId: id,
      newStatus: status,
      AppointmentId: appointmentId,
    };
    try {
      await axios.post(`http://localhost:3001/api/update-appointment-status`, data);
    } catch (error) {
      console.error("Error Updating Appointment status", error);
    }
  };

