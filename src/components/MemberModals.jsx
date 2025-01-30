import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import { Button as AntButton, Modal,Dropdown ,message,Alert } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { DownOutlined } from '@ant-design/icons';
import { updateAppointmentStatus } from '../utils/apiUtils';
import { ConfirmbookingMessage } from "../messageTemplates/confirmbookingMessage.jsx";

export const MemberModals = (props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isCancel, setIsCancel] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
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
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("");
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const items = [
    {
      key: '1',
      label: 'Reschedule',
      onClick:() =>handleButtonClick(props.specialistId)
    },
    {
      key: '2',
      label: 'Follow-Up',
    },
  ];
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
    setIsCancel(false);
    setSelectedDates([null, null, null]);
    setTimeRanges([
      { start: null, end: null },
      { start: null, end: null },
      { start: null, end: null },
    ]);
    setSelectedDate(null);
    setTimeRange({ start: null, end: null });
    setDatesSelected(false)
  };
  const resetDatesAndTime =()=>{
    setSelectedDates([null, null, null]);
        setTimeRanges([
          { start: null, end: null },
          { start: null, end: null },
          { start: null, end: null },
        ]);
  }
  const handleSpecialistSelect = (specialist) => {
    setSelectedSpecialist(specialist);
    if (specialist === "BIOKINETICIST") {
      resetDatesAndTime()
      setSelectedSpecialistID(1);
      setIsDietitian(false);
    } else if (specialist === "DIETITIAN") {
      setSelectedSpecialistID(2);
      setIsDietitian(true);
    } else if (specialist === "PHYSIOTHERAPIST") {
      resetDatesAndTime()
      setSelectedSpecialistID(3);
      setIsDietitian(false);
    }
  };

  const handleDietitianName = (name) => {
    setSelectedDate(null);
    setTimeRange({ start: null, end: null });
    setSpecialistName(name);
  };

  const handleNext = () => {
    const requiredCredits = selectedSpecialist === "DIETITIAN" ? 3 : 1;
    if (step === 1 && credits < requiredCredits) {
      setShowCreditModal(true);
    } else {
      if (step === 1 && selectedSpecialist === "DIETITIAN") {
        setStep(2); // Proceed to dietitian selection
      } else if (step === 2 && isDietitian) {
        resetDatesAndTime();
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
  const handleAppointmentActions =()=>{
    setIsCancel(true)
    setOpen(true);
  }
   const handleStatus = async (status) => {
      await updateAppointmentStatus(props.memberId, props.AppointmentId, status);
      handleClose();
    };

  const handleBooking = async () => {
    console.log(specialistName,"this the name")
    setModalText("The booking is being processed...");
    setConfirmLoading(true);

    let bookingData;
    if (isDietitian) {
      bookingData = {
        memberId: props.memberId,
        memberName: props.memberName,
        specialistId: selectedSpecialistID ?selectedSpecialistID:2,
        specialistName: specialistName,
        selectedSpecialist: selectedSpecialist,
        timeRange: timeRange,
        selectedDate: selectedDate,
        appointmentId:props.AppointmentId,
        type: "appointmentConfirmation",
        status: props.rescheduleModal ? "Rescheduled" : "Pending"
      };
    } else {
      bookingData = {
        memberId: props.memberId,
        memberName: props.memberName,
        specialistId: selectedSpecialistID,
        selectedSpecialist: selectedSpecialist,
        specialistName: specialistName,
        timeRanges: timeRanges,
        selectedDates: selectedDates,
        appointmentId:props.AppointmentId,
        type: "appointmentConfirmation",
        status: props.rescheduleModal ? "Rescheduled" : "Pending"
      };
    }

    try {
      await axios.post("http://localhost:3001/api/bookings", bookingData);
      // props.setRefresh(true)
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
        handleClose();
        const message = (
          <ConfirmbookingMessage
            isDietitian={isDietitian}
            specialistName={specialistName}
            selectedDate={selectedDate}
            timeRange={timeRange}
            selectedSpecialist={selectedSpecialist}
            selectedDates={selectedDates}
            timeRanges={timeRanges}
          />
        )
        setConfirmationMessage(message);
        setShowConfirmationModal(true);
        
      }, 2000);
      if (!isDietitian) {
        await axios.post("http://localhost:3001/api/send-email", bookingData);
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      setConfirmLoading(false);
    }
  };

  useEffect(() => {
    const allDatesSelected = selectedDates.every((date) => date !== null);
    const allTimesSelected = timeRanges.every(
      (range) => range.start !== null && range.end !== null
    );

    if (isDietitian) {
      setDatesSelected(!!specialistName);
    } else {
      setDatesSelected(allDatesSelected && allTimesSelected);
    }
  }, [selectedDates, timeRanges, step, isDietitian, specialistName]);

  useEffect(() => {}, [specialistName]);

  const handleButtonClick = (specialistId) => {
    if (specialistId === 2) {
      setIsDietitian(true);
    }
  
    if (step === 1 && props.rescheduleModal === "rescheduleModal") {
      setStep(specialistId === 2 ? 3 : 2);
    }
  
    setOpen(true);
  };

  return (
    <>
      {props.rescheduleModal === "rescheduleModal" ? (
        <>
          <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => handleAppointmentActions()}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <Dropdown
            menu={{
              items,
            }}
          >
            <a>
              More <DownOutlined />
            </a>
          </Dropdown>
        </>
      ) : (
        <AntButton type="primary" onClick={() => setOpen(true)}>
          BOOK APPOINTMENT
        </AntButton>
      )}
      {!showCreditModal && (
        <Modal
          title={
            <div className="text-center w-full text-3xl font-bold text-blue-600">
              {step === 1 && isCancel
                ? "Confirm Action"
                : step === 1
                ? "Choose your Specialist"
                : step === 2 && !isDietitian
                ? "CHOOSE THREE DATES"
                : step === 2 && isDietitian
                ? "CHOOSE A DIETITIAN"
                : step === 3 && isDietitian
                ? "Book from this website"
                : step === 3 && !isDietitian
                ? "CONFIRM BOOKING"
                : "CONFIRMED BOOKING DETAILS"}
            </div>
          }
          centered
          open={open}
          onCancel={handleClose}
          footer={[
            step > 1 && !props.rescheduleModal &&(
              <AntButton key="back" onClick={handleBack}>
                Previous
              </AntButton>
            ),
            step === 1 &&
              isCancel && [
                <AntButton key="back" onClick={handleClose}>
                  No
                </AntButton>,
                <AntButton
                  key="confirm"
                  type="primary"
                  onClick={() => {
                    handleStatus("Cancelled");
                    props.autoRefresh();
                    message.success("Appointment Cancelled.");
                  }}
                >
                  Yes
                </AntButton>,
              ],
            !isCancel && (
              <AntButton
                key="next"
                type="primary"
                onClick={
                  (step === 3 && !isDietitian) || (step === 4 && isDietitian)
                    ? handleBooking
                    : handleNext
                }
                loading={
                  (step === 3 && !isDietitian) || (step === 4 && isDietitian)
                    ? confirmLoading
                    : false
                }
                disabled={
                  (step === 1 && !selectedSpecialist) ||
                  (step === 2 && !datesSelected) ||
                  (step === 2 && isDietitian && !specialistName) ||
                  (step === 3 &&
                    isDietitian &&
                    (!selectedDate || !timeRange.start))
                }
              >
                {step === 3 && !isDietitian
                  ? "Book"
                  : step === 4 && isDietitian
                  ? "Submit"
                  : "Next"}
              </AntButton>
            ),
          ]}
          width={1000}
        >
          {step === 1 && !isCancel && (
            <div className="specialistOptions">
              <AntButton
                onClick={() => handleSpecialistSelect("BIOKINETICIST")}
                className={`text-lg ${
                  selectedSpecialist === "BIOKINETICIST" ? "selected" : ""
                }`}
              >
                BIOKINETICIST
              </AntButton>
              <AntButton
                onClick={() => handleSpecialistSelect("DIETITIAN")}
                className={`text-lg ${
                  selectedSpecialist === "DIETITIAN" ? "selected" : ""
                }`}
              >
                DIETITIAN
              </AntButton>
              <AntButton
                onClick={() => handleSpecialistSelect("PHYSIOTHERAPIST")}
                className={`text-lg ${
                  selectedSpecialist === "PHYSIOTHERAPIST" ? "selected" : ""
                }`}
              >
                PHYSIOTHERAPIST
              </AntButton>
            </div>
          )}
          {step === 1 && isCancel && (
            <p className="text-xl">
              <ExclamationCircleOutlined
                style={{ color: "red", marginRight: "8px" }}
              />
              Are you sure you want to <strong>cancel</strong> this appointment?
            </p>
          )}
          {step === 2 && !isDietitian && (
            <>
              <p className="text-lg mb-2">
                Please select <strong>three</strong> dates and corresponding{" "}
                <strong>time</strong> ranges for your availability to continue
              </p>
              {props.rescheduleModal && (<div className="flex space-x-4">
                <Alert
                  message="Reminder"
                  description="To reschedule, please do so at least 24 hours in advance. Otherwise, credits will be used or payment will be required by the practice."
                  type="warning"
                  showIcon
                  style={{
                    marginBottom: "8px",
                    maxWidth: "400px",
                    padding: "4px 14px",
                  }}
                />
                <Alert
                  message="Note"
                  description="Please ensure that the new dates and times you select do not conflict with any other commitments."
                  type="info"
                  showIcon
                  style={{
                    marginBottom: "8px",
                    maxWidth: "400px",
                    padding: "4px 14px",
                  }}
                />
              </div>)}
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
            </>
          )}
          {step === 2 && isDietitian && (
            <div className="dietitianOptions">
              <AntButton
                onClick={() => handleDietitianName("NATASHIA")}
                className={`text-lg ${
                  specialistName === "NATASHIA" ? "selected" : ""
                }`}
              >
                NATASHIA
              </AntButton>
              <AntButton
                onClick={() => handleDietitianName("MARIE")}
                className={`text-lg ${
                  specialistName === "MARIE" ? "selected" : ""
                }`}
              >
                MARIE
              </AntButton>
            </div>
          )}
          {step === 3 && isDietitian && (
            <>
              <p className="text-lg font-medium text-gray-800 mb-4">
                Please click the following button to make a booking with the
                dietitian. The link will open in a new tab.
              </p>
              <AntButton
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105"
                href="https://mygc.co.za/external/diary/9e23cd11-ae21-41d3-90c1-88d7f523d73f"
                target="_blank"
                rel="noopener noreferrer"
                type="primary"
              >
                Book a consultation with {specialistName?specialistName:props.specialistName}
              </AntButton>
              <br />
              <br />
              <p className="text-lg">
                After successfully making the booking, please enter the booking
                details below.
              </p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ my: 4 }}>
                  <DatePicker
                    label="Selected Date"
                    value={selectedDate || null}
                    onChange={handleConfirmDate}
                    shouldDisableDate={(date) => shouldDisableDate(date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                  &nbsp;
                  <TimePicker
                    label="Selected Time"
                    value={timeRange.start || null}
                    onChange={(time) => handleConfirmTime(time, "start")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    ampm={false}
                  />
                </Box>
              </LocalizationProvider>
            </>
          )}
          {step === 3 && !isDietitian && (
            <div className="memberDetails">
              <p className="text-lg font-semibold text-orange-600 mb-4">
                Please ensure all details are correct before proceeding with
                your booking.
              </p>

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
              <p className="text-lg font-semibold text-orange-600 mb-4">
                Please ensure all details are correct before proceeding with
                your booking.
              </p>
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
        title={
          <div className="text-2xl">
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: "8px" }}
            />
            Insufficient Credits
          </div>
        }
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
        <p className="text-base">
          You don't have enough credits to book this specialist. You will need
          to pay using cash/card.
        </p>
      </Modal>
      <Modal
        title={<div className="text-2xl">Booking Confirmation</div>}
        centered
        open={showConfirmationModal}
        onCancel={() => {
          setShowConfirmationModal(false);
          props.autoRefresh(); // Call the callback to refresh the dashboard
        }}
        footer={[
          <AntButton
            key="close"
            type="primary"
            onClick={() => {
              setShowConfirmationModal(false);
              props.autoRefresh(); // Call the callback to refresh the dashboard
            }}
          >
            Close
          </AntButton>,
        ]}
      >
        <p>{confirmationMessage}</p>
      </Modal>
    </>
  );
};