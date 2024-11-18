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
import { Box, TextField, Typography } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { el } from "date-fns/locale";
import dayjs from "dayjs";
import TestModal from "./TestModal";
export const MemberModals = (props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedDietitian, setSelectedDietitian] = useState(null);
  const [selectedSpecialistID, setSelectedSpecialistID] = useState(null);
  const [time, setTime] = useState(null);
  const [currentDate, setNewDate] = useState(null);
  const [isDietitian, setIsDietitian] = useState(false);

  const [selectedDates, setSelectedDates] = useState([null, null, null]);
  const [timeRanges, setTimeRanges] = useState({});
  const [datesSelected, setDatesSelected] = useState(false); //state is used to determine if all dates have been selected.

  const handleDateChange = (date, index) => {
    const newDates = [...selectedDates];
    newDates[index] = date;
    setSelectedDates(newDates);

    // Initialize timeRanges for the selected date
    setTimeRanges((prevTimeRanges) => ({
      ...prevTimeRanges,
      [date]: { start: null, end: null },
    }));

    console.log(`Date ${index + 1} selected:`, date);
  };

  const handleTimeChange = (date, time, type) => {
    setTimeRanges((prevTimeRanges) => {
      const newTimeRanges = { ...prevTimeRanges };
      if (!newTimeRanges[date]) {
        newTimeRanges[date] = {};
      }
      newTimeRanges[date][type] = time;
      return newTimeRanges;
    });
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
  const onChange = (event, data) => {
    setNewDate(data.value);
  };
  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setSelectedSpecialist(null);
    setSelectedDietitian(null);
    setTime(null);
    setIsDietitian(false);
    setSelectedDates([null, null, null]);
    setTimeRanges({});
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
    setSelectedDietitian(name);
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
    // let bookingData;

    // if (isDietitian) {
    //   bookingData = {
    //     memberId: props.memberId, // Assuming you have memberId in props
    //     memberName: props.userName,
    //     specialistId: selectedSpecialistID, // You need to map this to the actual specialist ID
    //     selectedDietitian: selectedDietitian,
    //     selectedSpecialist: selectedSpecialist,
    //     date: null, //need to convert this one
    //     status: "Pending", // Default status
    //   };
    // } else {
    //   bookingData = {
    //     memberId: props.memberId, // Assuming you have memberId in props
    //     specialistId: selectedSpecialistID, // You need to map this to the actual specialist ID
    //     memberName: props.userName,
    //     selectedSpecialist: selectedSpecialist,
    //     time: time.format("HH:mm"),
    //     date: currentDate
    //       .toLocaleDateString("en-GB")
    //       .split("/")
    //       .reverse()
    //       .join("-"), //need to convert this one
    //     status: "Pending", // Default status
    //   };
    // }

    try {
      // await axios.post("http://localhost:3001/api/bookings", bookingData);
      handleClose();
      // await axios.post("http://localhost:3001/api/send-email", bookingData);
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };
  useEffect(() => {
    const allDatesSelected = selectedDates.every((date) => date !== null);
    const allTimesSelected = selectedDates.every(
      (date) =>
        date &&
        timeRanges[date]?.start !== null &&
        timeRanges[date]?.end !== null
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
                {Array.from({ length: 3 }).map((_, index) => (
                  <Box key={index} sx={{ my: 4 }}>
                    
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
                    />
                    &nbsp;
                    {selectedDates[index] && (
                      <>
                        <TimePicker
                          label="From"
                          value={
                            timeRanges[selectedDates[index]]?.start || null
                          }
                          onChange={(time) =>
                            handleTimeChange(
                              selectedDates[index],
                              time,
                              "start"
                            )
                          }
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                          ampm={false}
                        />
                        &nbsp;
                        <TimePicker
                          label="To"
                          value={timeRanges[selectedDates[index]]?.end || null}
                          onChange={(time) =>
                            handleTimeChange(selectedDates[index], time, "end")
                          }
                          renderInput={(params) => (
                            <TextField {...params} fullWidth />
                          )}
                          ampm={false}
                        />
                      </>
                    )}
                  </Box>
                ))}
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
                    {selectedDates.map((date, index) => (
                      <>
                        <div>
                          <span>
                            <strong>Day {index + 1}:</strong>
                          </span>
                          <span>{dayjs(date).format("YYYY-MM-DD")}</span>
                          <span>
                            <span>
                              <strong>From:</strong>
                            </span>&nbsp;
                            <span>
                              {timeRanges[date]?.start
                                ? dayjs(timeRanges[date].start).format("HH:mm")
                                : "N/A"}
                            </span>
                          </span>
                          <span>
                            <span><strong>To:</strong></span>&nbsp;
                            <span> {timeRanges[date]?.end
                              ? dayjs(timeRanges[date].end).format("HH:mm")
                              : "N/A"}</span>
                           
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
