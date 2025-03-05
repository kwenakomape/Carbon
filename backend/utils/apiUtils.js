import axios from "axios";
export const updateAppointmentStatus = async (id, appointmentId, status,payment_method) => {
    let data = {
      memberId: id,
      newStatus: status,
      AppointmentId: appointmentId,
      paymentMethod:payment_method,
    };
    try {
      await axios.post(`/api/update-appointment-status`, data);
    } catch (error) {
      console.error("Error Updating Appointment status", error);
    }
  };

  export const updateNotesStatus = async (id, appointmentId, notesStatus) => {
    let data = {
      memberId: id,
      notes_status: notesStatus,
      AppointmentId: appointmentId,
    };
    try {
      await axios.post(`/api/update-notes-status`, data);
    } catch (error) {
      console.error("Error Updating Notes status", error);
    }
  };

