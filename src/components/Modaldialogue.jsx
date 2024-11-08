import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Modal,
} from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import SemanticDatepicker from "react-semantic-ui-datepickers";
import axios from "axios";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';


export const Modaldialogue = (props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [value, setValue] = useState(null);
  const [currentDate, setNewDate] = useState(null);

  const onChange = (event, data) => {
    setNewDate(data.value);
  };

  const handleSpecialistSelect = (specialist) => {
    setSelectedSpecialist(specialist);
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setSelectedSpecialist(null);
    setValue(null);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };
  const handleBooking = async () => {
    
    const formattedDate = date.toLocaleDateString('en-GB').split('/').reverse().join('-');
    const bookingData = {
      memberId: props.memberId, // Assuming you have memberId in props
      specialistId: 1, // You need to map this to the actual specialist ID
      date: formattedDate, //need to convert this one
      status: 'Pending', // Default status
    };

    try {
      await axios.post('http://localhost:3001/api/bookings', bookingData);
      handleClose();
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };
  return (
    <>
      <Button positive onClick={() => setOpen(true)}>
        BOOK APPOINTMENT
      </Button>
      <Modal
        closeIcon
        onClose={handleClose}
        open={open}
        closeOnDimmerClick={false}
      >
        {step === 1 && (
          <>
            <ModalHeader className="book-modal-centered-header">Choose your Specialist</ModalHeader>
            <ModalContent>
              <div className="specialistOptions">
                <Button
                  onClick={() => handleSpecialistSelect("BIOKINETICIST")}
                  className={selectedSpecialist === "BIOKINETICIST" ? "selected" : ""}
                >
                  BIOKINETICIST
                </Button>
                <Button
                  onClick={() => handleSpecialistSelect("DIETITIAN")}
                  className={selectedSpecialist === "DIETITIAN" ? "selected" : ""}
                >
                  DIETITIAN
                </Button>
                <Button
                  onClick={() => handleSpecialistSelect("PHYSIOTHERAPIST")}
                  className={selectedSpecialist === "PHYSIOTHERAPIST" ? "selected" : ""}
                >
                  PHYSIOTHERAPIST
                </Button>
              </div>
            </ModalContent>
            <ModalActions>
              <Button
                onClick={handleNext}
                primary
                disabled={!selectedSpecialist}
              >
                Next <Icon name="right chevron" />
              </Button>
            </ModalActions>
          </>
        )}
        {step === 2 && (
          <>
            <ModalHeader id="calender-modal-centered-header">
              <Button icon="left chevron" content="Previous" onClick={handleBack} />
              <span>CHOOSE A DATE</span>
            </ModalHeader>
            <ModalContent>
              
              <SemanticDatepicker inline onChange={onChange} />
            </ModalContent>
            <ModalActions>
              <Button icon="check" content="Next" primary onClick={handleNext} />
            </ModalActions>
          </>
        )}
        {step === 3 && (
          <>
            <ModalHeader id="time-modal-centered-header">
              <Button icon="left chevron" content="Previous" onClick={handleBack} />
              <span>CHOOSE A TIME</span>
            </ModalHeader>
            <ModalContent>
              <div className="select-time-appointment">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Select Time"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                  />
                </LocalizationProvider>
              </div>
            </ModalContent>
            <ModalActions>
              <Button icon="check" primary content="Next" onClick={handleNext} />
            </ModalActions>
          </>
        )}
        {step === 4 && (
          <>
            <ModalHeader id="confirmation-modal-centered-header">
              <Button icon="left chevron" content="Previous" onClick={handleBack} />
              <span>CONFIRM BOOKING</span>
            </ModalHeader>
            <ModalContent>
              <div className="memberDetails">
                <div>
                  <span><strong>Name:</strong></span>
                  <span>{props.userName}</span>
                </div>
                <div>
                  <span><strong>Speciality:</strong></span>
                  <span>{selectedSpecialist}</span>
                </div>
                <div>
                  <span><strong>Date:</strong></span>
                  <span>{currentDate ? currentDate.toDateString() : 'None'}</span>
                  
                </div>
                <div>
                  <span><strong>Time:</strong></span>
                  <span>{value ? value.format('HH:mm') : ''}</span>
                </div>
              </div>
            </ModalContent>
            <ModalActions  className="centered-actions">
              {/* <Button icon="check" positive content="Book" onClick={handleClose} /> */}
              <Button icon="check" positive content="Book" onClick={handleBooking} />
            </ModalActions>
          </>
        )}
      </Modal>
    </>
  );
};
