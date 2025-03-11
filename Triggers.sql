DELIMITER $$

CREATE TRIGGER after_appointment_insert
AFTER INSERT ON Appointments
FOR EACH ROW
BEGIN
  IF NEW.status = 'Pending' THEN
    INSERT INTO Notifications (appointment_id, notification_type, message)
    VALUES (NEW.appointment_id, 'Booking Request', CONCAT('New booking request from member ID ', NEW.member_id));
  END IF;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER after_appointment_update
AFTER UPDATE ON Appointments
FOR EACH ROW
BEGIN
  IF NEW.status = 'Cancelled' THEN
    INSERT INTO Notifications (appointment_id, notification_type, message)
    VALUES (NEW.appointment_id, 'Cancellation', CONCAT('Booking cancelled by member ID ', NEW.member_id));
  END IF;
END$$

DELIMITER ;

DELIMITER $$

CREATE TRIGGER after_appointment_reschedule
AFTER UPDATE ON Appointments
FOR EACH ROW
BEGIN
  IF NEW.status = 'Pending Reschedule' THEN
    INSERT INTO Notifications (appointment_id, notification_type, message)
    VALUES (NEW.appointment_id, 'Rescheduling', CONCAT('Booking rescheduled by member ID ', NEW.member_id));
  END IF;
END$$

DELIMITER ;
DELIMITER $$

CREATE TRIGGER after_appointment_confirmation
AFTER UPDATE ON Appointments
FOR EACH ROW
BEGIN
  IF NEW.status = 'Confirmed' THEN
    INSERT INTO Notifications (appointment_id, notification_type, message)
    VALUES (NEW.appointment_id, 'Confirmation', CONCAT('Booking confirmed for member ID ', NEW.member_id));
  END IF;
END$$

DELIMITER ;