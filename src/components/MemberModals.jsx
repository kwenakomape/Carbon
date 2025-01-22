import {
  ModalHeader,
  ModalDescription,
  ModalContent,
  ModalActions,
  Button,
  Icon,
} from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import { Button as AntButton, Modal } from 'antd';
import dayjs from "dayjs";
export const MemberModals = (props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedSpecialist, setSelectedSpecialist] = useState(null);
  const [selectedSpecialistID, setSelectedSpecialistID] = useState(null);
  const [specialistName, setSpecialistName] = useState(null);
const [isDietitian, setIsDietitian] = useState(false);
  const [selectedDates, setSelectedDates] = useState([null, null, null]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const [timeRanges, setTimeRanges] = useState([
    { start: null, end: null },
    { start: null, end: null },
    { start: null, end: null },
  ]);
  const [datesSelected, setDatesSelected] = useState(false);
  const [credits, setCredits] = useState(props.memberCredits);
  const [showCreditModal, setShowCreditModal] = useState(false);

  const handleConfirmDate = (date) => {
    setSelectedDate(date);
    if (!timeRange.start) {
      setTimeRange({ start: null, end: null });
    }
  };
  const handleConfirmTime = (time, type) => {
    setTimeRange((prevTimeRange) => ({ ...prevTimeRange, [type]: time }));
  };
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
    setSpecialistName(null);
    setIsDietitian(false);
    setSelectedDates([null, null, null]);
    setTimeRanges([{}, {}, {}]);
    setSelectedDate(null);
    setTimeRange({ start: null, end: null });
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
      setSelectedSpecialistID(3);
      setIsDietitian(false);
    }
  };

  const handleDietitianName = (name) => {
    setSelectedDate(null);
    setTimeRange({ start: null, end: null });
    setSpecialistName(name);
    console.log("Selected Dietitian:", name);
  };

  const handleNext = () => {
    const requiredCredits = selectedSpecialist === "DIETITIAN" ? 3 : 1;
    if (step === 1 && credits < requiredCredits) {
      setShowCreditModal(true);
    } else {
      if (step === 1 && selectedSpecialist === "DIETITIAN") {
        setStep(2); // Proceed to dietitian selection
      } else if (step === 2 && isDietitian) {
        setStep(3); // Proceed to date selection for dietitian
      } else if (step === 2 && !isDietitian) {
        setStep(3); // Skip to confirmation for physio and bio
      } else if (step === 3 && isDietitian) {
        setStep(4); // Proceed to confirmation for dietitian
      } else if (step === 3 && !isDietitian) {
        handleBooking(); // Call handleBooking for non-dietitian
      } else if (step === 4 && isDietitian) {
        handleBooking(); // Call handleBooking for dietitian
      } else {
        setStep(step + 1);
      }
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
        timeRange:timeRange,
        selectedDate:selectedDate,
        type: "appointmentConfirmation",
        status: "Confirmed", // Default status
      };
    } else {
      bookingData = {
        memberId: props.memberId, // Assuming you have memberId in props
        memberName: props.memberName,
        specialistId: selectedSpecialistID, // You need to map this to the actual specialist ID
        selectedSpecialist: selectedSpecialist,
        specialistName: specialistName, // Ask which specialist will recieve the email
        timeRanges: timeRanges,
        selectedDates: selectedDates,
        type: "appointmentConfirmation",
        status: "Pending", // Default status
      };
    }

    try {
      await axios.post("http://localhost:3001/api/bookings", bookingData);
      handleClose();
      if (!isDietitian) {
        await axios.post("http://localhost:3001/api/send-email", bookingData);
    }
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  useEffect(() => {
    const allDatesSelected = selectedDates.every((date) => date !== null);
    const allTimesSelected = timeRanges.every(
      (range) => range.start !== null && range.end !== null
    );

    setDatesSelected(allDatesSelected && allTimesSelected);
  }, [selectedDates, timeRanges]);

  return (
    <>
      {/* <AntButton type="primary" onClick={() => setOpenResponsive(true)}>
        BOOK APPOINTMENT
      </AntButton>
      <Modal
        title="Modal responsive width"
        centered
        open={openResponsive}
        onOk={() => setOpenResponsive(false)}
        onCancel={() => setOpenResponsive(false)}
        footer={[
          <AntButton key="submit" type="primary" >
            Next
          </AntButton>
        ]}
        width={{
          xs: '90%',
          sm: '80%',
          md: '70%',
          lg: '60%',
          xl: '50%',
          xxl: '40%',
        }}
      >
      hi
        
      </Modal> */}
      <AntButton type="primary" onClick={() => setOpen(true)}>
        BOOK APPOINTMENT
      </AntButton>
      {!showCreditModal && (
        <Modal
          title={
            step === 1
              ? "Choose your Specialist"
              : step === 2 && !isDietitian
              ? "CHOOSE THREE DATES"
              : step === 2 && isDietitian
              ? "CHOOSE A DIETITIAN"
              : step === 3 && isDietitian
              ? "Book from this website"
              : step === 3 && !isDietitian
              ? "CONFIRM BOOKING"
              : "CONFIRMED BOOKING DETAILS"
          }
          centered
          open={open}
          onCancel={handleClose}
          footer={[
            step > 1 && (
              <AntButton key="back" onClick={handleBack}>
                Previous
              </AntButton>
            ),
            <AntButton
              key="next"
              type="primary"
              onClick={handleNext}
              disabled={
                (step === 1 && !selectedSpecialist) ||
                (step === 2 && !datesSelected) ||
                (step === 2 && isDietitian && !specialistName)
              }
            >
              {step === 3 && !isDietitian
                ? "Book"
                : step === 4 && isDietitian
                ? "Submit"
                : "Next"}
            </AntButton>,
          ]}
          width={1000}
         
        >
          {step === 1 && (
            <div className="specialistOptions">
              <AntButton
                onClick={() => handleSpecialistSelect("BIOKINETICIST")}
                className={
                  selectedSpecialist === "BIOKINETICIST" ? "selected" : ""
                }
              >
                BIOKINETICIST
              </AntButton>
              <AntButton
                onClick={() => handleSpecialistSelect("DIETITIAN")}
                className={selectedSpecialist === "DIETITIAN" ? "selected" : ""}
              >
                DIETITIAN
              </AntButton>
              <AntButton
                onClick={() => handleSpecialistSelect("PHYSIOTHERAPIST")}
                className={
                  selectedSpecialist === "PHYSIOTHERAPIST" ? "selected" : ""
                }
              >
                PHYSIOTHERAPIST
              </AntButton>
            </div>
          )}
          {step === 2 && !isDietitian && (
            <>
              <p>
                Please select <strong>three</strong> dates and{" "}
                <strong>time</strong> ranges for your availability to continue
              </p>
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
                    &nbsp;
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
                    />
                    &nbsp;
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
            </>
          )}
          {step === 2 && isDietitian && (
            <div className="dietitianOptions">
              <AntButton
                onClick={() => handleDietitianName("NATASHIA")}
                className={specialistName === "NATASHIA" ? "selected" : ""}
              >
                NATASHIA
              </AntButton>
              <AntButton
                onClick={() => handleDietitianName("MARIE")}
                className={specialistName === "MARIE" ? "selected" : ""}
              >
                MARIE
              </AntButton>
            </div>
          )}
          {step === 3 && isDietitian && (
            <>
              <p>
                Please click the following link to make a booking with the
                dietitian. The link will open in a new tab.
              </p>
              <AntButton
                href="https://mygc.co.za/external/diary/9e23cd11-ae21-41d3-90c1-88d7f523d73f"
                target="_blank"
                rel="noopener noreferrer"
                type="primary"
              >
                Book a consultation with {specialistName}
              </AntButton>
              <br />
              <br />
              <p>
                After successfully making the booking, please enter the booking
                details below.
              </p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ my: 4 }}>
                  {" "}
                  <DatePicker
                    label="Selected Date"
                    value={selectedDate || null}
                    onChange={handleConfirmDate}
                    shouldDisableDate={(date) => shouldDisableDate(date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />{" "}
                  &nbsp;{" "}
                  <TimePicker
                    label="Selected Time"
                    value={timeRange.start || null}
                    onChange={(time) => handleConfirmTime(time, "start")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    ampm={false}
                  />
                </Box>{" "}
              </LocalizationProvider>
            </>
          )}
          {step === 3 && !isDietitian && (
            <div className="memberDetails">
              <div>
                <strong>NAME:</strong> {props.memberName}
              </div>
              <div>
                <strong>SPECIALITY:</strong> {selectedSpecialist}
              </div>
              {selectedDates.map((date, index) => (
                <div key={index}>
                  <strong>Day {index + 1}:</strong>{" "}
                  {date ? dayjs(date).format("YYYY-MM-DD") : "N/A"}
                  <strong>From:</strong>{" "}
                  {timeRanges[index]?.start
                    ? dayjs(timeRanges[index].start).format("HH:mm")
                    : "N/A"}
                  <strong>To:</strong>{" "}
                  {timeRanges[index]?.end
                    ? dayjs(timeRanges[index].end).format("HH:mm")
                    : "N/A"}
                </div>
              ))}
            </div>
          )}
          {step === 4 && isDietitian && (
            <div className="memberDetails">
              <div>
                <strong>NAME:</strong> {props.memberName}
              </div>
              <div>
                <strong>SPECIALITY:</strong> {selectedSpecialist}
              </div>
              <div>
                <strong>Date:</strong>{" "}
                {dayjs(selectedDate).format("dddd, D MMMM YYYY")}
              </div>
              <div>
                <strong>Time:</strong> {dayjs(timeRange.start).format("HH:mm")}
              </div>
            </div>
          )}
        </Modal>
      )}
      <Modal
        title="Insufficient Credits"
        centered
        open={showCreditModal}
        onCancel={() => setShowCreditModal(false)}
        footer={[
          <AntButton
            key="continue"
            type="primary"
            onClick={() => {
              setShowCreditModal(false);
              setStep(step + 1); // Proceed with the booking process
            }}
          >
            Continue
          </AntButton>,
        ]}
      >
        <p>
          You don't have enough credits to book this specialist. You will need
          to pay using cash/card.
        </p>
      </Modal>
    </>
  );
};
