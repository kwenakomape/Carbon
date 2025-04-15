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


  export const createNotification = async (
    appointmentId,
    notification_type,
    recipient_type,
    recipient_id,
    initiated_by,
    initiator_id,
    member_id,
  ) => {
      let data = {
        appointment_id: appointmentId,
        notification_type: notification_type,
        recipient_type: recipient_type,
        recipient_id: recipient_id,
        initiated_by: initiated_by,
        initiator_id: initiator_id,
        member_id: member_id,
      };

      try {
        await axios.post(`/api/notifications`, data);
      } catch (error) {
        console.error("Error creating a notifcations", error);
      }
  };
