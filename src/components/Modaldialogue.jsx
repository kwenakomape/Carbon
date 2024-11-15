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
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { el } from "date-fns/locale";
export const Modaldialogue = (props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedDietitian, setSelectedDietitian] = useState(null);
  const [selectedSpecialistID, setSelectedSpecialistID] = useState(null);
  const [time, setTime] = useState(null);
  const [currentDate, setNewDate] = useState(null);
  const [isDietitian, setIsDietitian] = useState(false);

  const onChange = (event, data) => {
    setNewDate(data.value);
  };

  const handleSpecialistSelect = (specialist) => {
    setSelectedSpecialist(specialist);
    if(specialist==="BIOKINETICIST"){
        setSelectedSpecialistID(1);
        setIsDietitian(false);
    }
    else if(specialist==="DIETITIAN"){
        
        setSelectedSpecialistID(2);
        setIsDietitian(true);
    }
    else if(specialist==="PHYSIOTHERAPIST"){
        
        setSelectedSpecialistID(4);
        setIsDietitian(false);
    }
  };
  const handleDietitianName = (name) => {
    setSelectedDietitian(name);
  }

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setSelectedSpecialist(null);
    setSelectedDietitian(null);
    setTime(null);
    setIsDietitian(false);
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };
  const handleBooking = async () => {
    
    let bookingData;

    if(isDietitian){
      bookingData = {
        memberId: props.memberId, // Assuming you have memberId in props
        memberName:props.userName,
        specialistId: selectedSpecialistID, // You need to map this to the actual specialist ID
        selectedDietitian:selectedDietitian,
        selectedSpecialist:selectedSpecialist,
        date: null, //need to convert this one
        status: 'Pending', // Default status
        
      };
    }else{
      bookingData = {
        memberId: props.memberId, // Assuming you have memberId in props
        specialistId: selectedSpecialistID, // You need to map this to the actual specialist ID
        memberName:props.userName,
        selectedSpecialist:selectedSpecialist,
        time:time.format("HH:mm"),
        date: currentDate.toLocaleDateString('en-GB').split('/').reverse().join('-'), //need to convert this one
        status: 'Pending', // Default status
        
      };
    }
 

    try {
      await axios.post("http://localhost:3001/api/bookings", bookingData);
      handleClose();
      await axios.post("http://localhost:3001/api/send-email",bookingData);
      
    } catch (error) {
      console.error("Error booking appointment:", error);
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
            <ModalHeader className="book-modal-centered-header">
              Choose your Specialist
            </ModalHeader>
            <ModalContent>
              <div className="specialistOptions">
                <Button
                  onClick={() => handleSpecialistSelect("BIOKINETICIST")}
                  className={
                    selectedSpecialist === "BIOKINETICIST" ? "selected" : ""
                  }
                >
                  BIOKINETICIST
                </Button>
                <Button
                  onClick={() => handleSpecialistSelect("DIETITIAN")}
                  className={
                    selectedSpecialist === "DIETITIAN" ? "selected" : ""
                  }
                >
                  DIETITIAN
                </Button>
                <Button
                  onClick={() => handleSpecialistSelect("PHYSIOTHERAPIST")}
                  className={
                    selectedSpecialist === "PHYSIOTHERAPIST" ? "selected" : ""
                  }
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
        {step === 2 && !isDietitian && (
          <>
            <ModalHeader id="calender-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>CHOOSE A DATE</span>
            </ModalHeader>
            <ModalContent>
              {/* <SemanticDatepicker inline onChange={onChange} /> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
              </LocalizationProvider>
            </ModalContent>
            <ModalActions>
              <Button
                icon="check"
                content="Next"
                primary
                onClick={handleNext}
              />
            </ModalActions>
          </>
        )}
        {step === 2 && isDietitian && (
          <>
            <ModalHeader id="chooseDietitian-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>CHOOSE A DIETITIAN</span>
            </ModalHeader>
            <ModalContent>
              <div className="dietitianOptions">
                <Button
                  onClick={() => handleDietitianName("NATASHIA")}
                  className={selectedDietitian === "NATASHIA" ? "selected" : ""}
                >
                  NATASHIA
                </Button>
                <Button
                  onClick={() => handleDietitianName("MARIE")}
                  className={selectedDietitian === "MARIE" ? "selected" : ""}
                >
                  MARIE
                </Button>
              </div>
            </ModalContent>
            <ModalActions>
              <Button
                icon="check"
                content="Next"
                primary
                onClick={handleNext}
              />
            </ModalActions>
          </>
        )}
        {step === 3 && !isDietitian && (
          <>
            <ModalHeader id="time-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>CHOOSE A TIME</span>
            </ModalHeader>
            <ModalContent>
              <div className="select-time-appointment">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Select Time"
                    value={time}
                    onChange={(newValue) => setTime(newValue)}
                  />
                </LocalizationProvider>
              </div>
            </ModalContent>
            <ModalActions>
              <Button
                icon="check"
                primary
                content="Next"
                onClick={handleNext}
              />
            </ModalActions>
          </>
        )}
        {step === 3 && isDietitian && (
          <>
            <ModalHeader id="bookfromwebsite-modal">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>Book from this website</span>
            </ModalHeader>
            <ModalContent>
              <div className="">display website</div>
            </ModalContent>
            <ModalActions className="centered-actions">
              <Button
                icon="check"
                primary
                content="DONE"
                onClick={handleNext}
              />
            </ModalActions>
          </>
        )}
        {step === 4 && (
          <>
            <ModalHeader id="confirmation-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>CONFIRM BOOKING</span>
            </ModalHeader>
            <ModalContent>
              <div className="memberDetails">
                <div>
                  <span>
                    <strong>NAME:</strong>
                  </span>
                  <span>{props.userName}</span>
                </div>

                <div>
                  <span>
                    <strong>SPECIALITY:</strong>
                  </span>
                  <span>{selectedSpecialist}</span>
                </div>
                {!isDietitian ? (
                  <>
                    <div>
                      <span>
                        <strong>Date:</strong>
                      </span>
                      <span>
                        {currentDate ? currentDate.toDateString() : "None"}
                      </span>
                    </div>
                    <div>
                      <span>
                        <strong>Time:</strong>
                      </span>
                      <span>{time ? time.format("HH:mm") : ""}</span>
                    </div>
                  </>
                ) : (
                  <div>
                    <span>
                      <strong>SPECIALIST:</strong>
                    </span>
                    <span>{selectedDietitian}</span>
                  </div>
                )}
              </div>
            </ModalContent>
            <ModalActions className="centered-actions">
              <Button
                icon="check"
                positive
                content="Book"
                onClick={handleBooking}
              />
            </ModalActions>
          </>
        )}
      </Modal>
    </>
  );
};
