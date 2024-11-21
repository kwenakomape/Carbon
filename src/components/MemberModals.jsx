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
import axios from "axios";
import { Box, TextField, Typography } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
export const MemberModals = (props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [specialistName, setSpecialistName] = useState(null);
  const [selectedSpecialistID, setSelectedSpecialistID] = useState(null);
  const [isDietitian, setIsDietitian] = useState(false);

  // const [selectedDates, setSelectedDates] = useState([null, null, null]);
  // const [timeRanges, setTimeRanges] = useState({});
  const [selectedDates, setSelectedDates] = useState([null, null, null]);
  const [timeRanges, setTimeRanges] = useState([
    { start: null, end: null },
    { start: null, end: null },
    { start: null, end: null }
  ]);
  const [datesSelected, setDatesSelected] = useState(false);
  


  const handleDateChange = (date, index) => {
    const newDates = [...selectedDates];
    newDates[index] = date;
    setSelectedDates(newDates);
    const newTimeRanges = [...timeRanges];
    if (!newTimeRanges[index]) {
      newTimeRanges[index] = { start: null, end: null };
    }
    setTimeRanges(newTimeRanges);
  };
  const handleTimeChange = (index, time, type) => {
    const newTimeRanges = [...timeRanges];
    if (!newTimeRanges[index]) {
      newTimeRanges[index] = { start: null, end: null };
    }
    newTimeRanges[index][type] = time;
    setTimeRanges(newTimeRanges);
  };
  
  const shouldDisableDate = (date, currentIndex) => {
    const today = dayjs().startOf("day");
    const day = dayjs(date).day();
    const isWeekend = day === 0 || day === 6;
    const isSelected = selectedDates.some((selectedDate, index) => {
      return (
        index !== currentIndex &&
        selectedDate &&
        dayjs(selectedDate).isSame(date, "day")
      );
    });
    const isBeforeToday = dayjs(date).isBefore(today);
    return isWeekend || isSelected || isBeforeToday;
  };
  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setSelectedSpecialist(null);
    setSpecialistName(null)
    setIsDietitian(false);
    setSelectedDates([null, null, null]);
    setTimeRanges([{}, {}, {}]);
  };
  const handleSpecialistSelect = (specialist) => {
    setSelectedSpecialist(specialist);
    if (specialist === "BIOKINETICIST") {
      setSelectedSpecialistID(1);
      setIsDietitian(false);
    } else if (specialist === "DIETITIAN") {
      setSelectedSpecialistID(2);
      setIsDietitian(true);
    } else if (specialist === "PHYSIOTHERAPIST") {
      setSelectedSpecialistID(4);
      setIsDietitian(false);
    }
  };
  const handleDietitianName = (name) => {
    setSpecialistName(name);
  };
  const handleNext = () => {
    if (step === 1 && selectedSpecialist === "DIETITIAN") {
      setStep(2); // Proceed to dietitian selection
    } else if (step === 2 && isDietitian) {
      setStep(3); // Proceed to date selection for dietitian
    } else if (step === 2 && !isDietitian) {
      setStep(3); // Skip to confirmation for physio and bio
    } else if (step === 3 && isDietitian) {
      setStep(4); // Proceed to confirmation for dietitian
    } else {
      
      setStep(step + 1);
    }

  };

  const handleBack = () => {
    setStep(step - 1);
  };
  const handleBooking = async () => {
    let bookingData;

    if (isDietitian) {
      bookingData = {
        memberId: props.memberId, // Assuming you have memberId in props
        memberName: props.memberName,
        specialistId: selectedSpecialistID, // You need to map this to the actual specialist ID
        specialistName: specialistName, //investigate thsi???
        selectedSpecialist: selectedSpecialist,
        date: null, //The the selected date(from the website wil be sent to the specialist email),but in the database it will be stored as null until confirmed by specilaist
        status: "Pending", // Default status
      };
    } else {
      bookingData = {
        memberId: props.memberId, // Assuming you have memberId in props
        memberName: props.memberName,
        specialistId: selectedSpecialistID, // You need to map this to the actual specialist ID
        selectedSpecialist: selectedSpecialist,
        specialistName: specialistName, // Ask which specialist will recieve the email
        timeRanges : timeRanges,
        selectedDates: selectedDates,
        status: "Pending", // Default status
      };
    }

    try {
      await axios.post("http://localhost:3001/api/bookings", bookingData);
      handleClose();
      await axios.post("http://localhost:3001/api/send-email", bookingData);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  useEffect(() => {
    const allDatesSelected = selectedDates.every(date => date !== null);
    const allTimesSelected = timeRanges.every(
      range => range.start !== null && range.end !== null
    );
  
    setDatesSelected(allDatesSelected && allTimesSelected);
  }, [selectedDates, timeRanges]);
  
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
              <span>CHOOSE THREE DATES</span>
            </ModalHeader>
            <ModalContent>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {" "}
                {Array.from({ length: 3 }).map((_, index) => (
                  <Box key={index} sx={{ my: 4 }}>
                    {" "}
                    <DatePicker
                      label={`Select Date ${index + 1}`}
                      value={selectedDates[index] || null}
                      onChange={(date) => handleDateChange(date, index)}
                      shouldDisableDate={(date) =>
                        shouldDisableDate(date, index)
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />{" "}
                    &nbsp;{" "}
                    <TimePicker
                      label="From"
                      value={timeRanges[index]?.start || null}
                      onChange={(time) =>
                        handleTimeChange(index, time, "start")
                      }
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      ampm={false}
                    />{" "}
                    &nbsp;{" "}
                    <TimePicker
                      label="To"
                      value={timeRanges[index]?.end || null}
                      onChange={(time) => handleTimeChange(index, time, "end")}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                      ampm={false}
                    />{" "}
                  </Box>
                ))}{" "}
              </LocalizationProvider>
            </ModalContent>
            <ModalActions>
              <Button
                icon="check"
                content="Next"
                primary
                disabled={!datesSelected}
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
                  className={specialistName === "NATASHIA" ? "selected" : ""}
                >
                  NATASHIA
                </Button>
                <Button
                  onClick={() => handleDietitianName("MARIE")}
                  className={specialistName === "MARIE" ? "selected" : ""}
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
        {step === 3 && !isDietitian && (
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
                  <span>{props.memberName}</span>
                </div>

                <div>
                  <span>
                    <strong>SPECIALITY:</strong>
                  </span>
                  <span>{selectedSpecialist}</span>
                </div>
                {!isDietitian ? (
                  <>
                    {selectedDates.map((date, index) => (
                      <div key={index}>
                        <span>
                          <strong>Day {index + 1}:</strong>
                        </span>
                        <span>
                          {date ? dayjs(date).format("YYYY-MM-DD") : "N/A"}
                        </span>
                        <span>
                          <span>
                            <strong>From:</strong>
                          </span>
                          &nbsp;
                          <span>
                            {timeRanges[index]?.start
                              ? dayjs(timeRanges[index].start).format("HH:mm")
                              : "N/A"}
                          </span>
                        </span>
                        <span>
                          <span>
                            <strong>To:</strong>
                          </span>
                          &nbsp;
                          <span>
                            {timeRanges[index]?.end
                              ? dayjs(timeRanges[index].end).format("HH:mm")
                              : "N/A"}
                          </span>
                        </span>
                      </div>
                    ))}
                  </>
                ) : (
                  <div>
                    <span>
                      <strong>SPECIALIST:</strong>
                    </span>
                    <span>{specialistName}</span>
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
        {step === 4 && isDietitian && (
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
                  <span>{props.memberName}</span>
                </div>

                <div>
                  <span>
                    <strong>SPECIALITY:</strong>
                  </span>
                  <span>{selectedSpecialist}</span>
                </div>
                {!isDietitian ? (
                  <>
                    {selectedDates.map((date, index) => (
                      <>
                        <div>
                          <span>
                            <strong>Day {index + 1}:</strong>
                          </span>
                          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
                          <span>
                            <strong>Start Time:</strong>
                            {timeRanges[date]?.start
                              ? dayjs(timeRanges[date].start).format("HH:mm")
                              : "N/A"}
                          </span>
                          <span>
                            <strong>End Time:</strong>
                            {timeRanges[date]?.end
                              ? dayjs(timeRanges[date].end).format("HH:mm")
                              : "N/A"}
                          </span>
                        </div>
                      </>
                    ))}
                  </>
                ) : (
                  <div>
                    <span>
                      <strong>SPECIALIST:</strong>
                    </span>
                    <span>{specialistName}</span>
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
