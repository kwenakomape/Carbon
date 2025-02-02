import axios from "axios";
export const updateAppointmentStatus = async (id, appointmentId, status) => {
    let data = {
      memberId: id,
      newStatus: status,
      AppointmentId: appointmentId,
    };
    try {
      await axios.post(`/api/update-appointment-status`, data);
    } catch (error) {
      console.error("Error Updating Appointment status", error);
    }
  };

