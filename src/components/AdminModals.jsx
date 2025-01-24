import axios from "axios";
import dayjs from "dayjs";
import { Box, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import { UploadFiles } from "./UploadFiles";

import React, { useState, useEffect } from "react";
import { Modal, Button } from "antd";

export const AdminModals = (props) => {
  const id = props.memberId;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isSeen, setIsSeen] = useState(false);
  const [isMissed, setIsMissed] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const [dateSelected, setDateSelected] = useState(false);

  const shouldDisableDate = (date) => {
    const today = dayjs().startOf("day");
    const day = dayjs(date).day();
    const isWeekend = day === 0 || day === 6;
    const isBeforeToday = dayjs(date).isBefore(today);
    return isWeekend || isBeforeToday;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (!timeRange.start) {
      setTimeRange({ start: null, end: null });
    }
  };

  const handleTimeChange = (time, type) => {
    setTimeRange((prevTimeRange) => ({ ...prevTimeRange, [type]: time }));
  };

  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setSelectedStatus(null);
    setSelectedPaymentMethod(null);
    setIsMissed(false);
    setIsSeen(false);
    setIsCancel(false);
    setSelectedDate(null);
    setTimeRange({ start: null, end: null });
  };

  const UpdateAppointmentStatus = async (status) => {
    let data = {
      memberId: id,
      newStatus: status,
      AppointmentId: props.AppointmentId,
    };
    try {
      await axios.post(`http://localhost:3001/api/update-appointment-status`, data);
    } catch (error) {
      console.error("Error Updating Appointment status", error);
    }
  };

  const handleStatus = async (status) => {
    await UpdateAppointmentStatus(status);
    handleClose();
  };

  const handleDateConfirmation = async () => {
    let data = {
      memberId: id,
      memberName: props.memberName,
      appointmentId: props.AppointmentId,
      selectedDate: selectedDate,
      timeRange: timeRange,
      phoneNumber: props.phoneNumber,
    };

    try {
      await axios.post("http://localhost:3001/api/confirm-date", data);
      handleClose();

      await axios.post("http://localhost:3001/api/send-appointment-details", data);
    } catch (error) {
      console.error("Error Confirming SMS:", error);
    }
  };

  const handleSelectedStatus = (status) => {
    if (status === "MISSED") {
      setIsMissed(true);
      setIsSeen(false);
      setIsCancel(false);
      setIsModify(false);
    } else if (status === "CANCELED") {
      setIsMissed(false);
      setIsSeen(false);
      setIsCancel(true);
      setIsModify(false);
    } else if (status === "SEEN") {
      setIsMissed(false);
      setIsSeen(true);
      setIsCancel(false);
      setIsModify(false);
    } else if (status === "MODIFY") {
      setIsMissed(false);
      setIsSeen(false);
      setIsModify(true);
      setIsCancel(false);
    }
    setSelectedStatus(status);
  };

  const handleSelectedPaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };

  const handleNext = () => {
    if (step === 2 && selectedPaymentMethod === "CASH/CARD") {
      setStep(4); // New step for confirmation modal
    } else {
      setStep(step + 1);
    }
  };

  const handleBackToPaymentMethod = () => {
    setStep(2); // Go back to the "Select Payment Method" step
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    const isDateSelected = selectedDate !== null;
    const isTimeRangeSelected = timeRange.start !== null && timeRange.end !== null;
    setDateSelected(isDateSelected && isTimeRangeSelected);
  }, [selectedDate, timeRange]);

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        Manage
      </Button>
      <Modal
        title={
          step === 1
            ? "Select Status"
            : step === 2 && isMissed
            ? "Confirm Action"
            : step === 2 && isModify
            ? "Choose a Date and Time"
            : step === 2 && isCancel
            ? "Confirm Action"
            : step === 2 && isSeen
            ? "Select Payment Method"
            : step === 3 && selectedPaymentMethod === "SSISA CREDITS"
            ? "Confirm Payment by SSISA Credits"
            : step === 4 && selectedPaymentMethod === "CASH/CARD"
            ? "Confirm Payment Method"
            : ""
        }
        centered
        open={open}
        onCancel={handleClose}
        footer={
          step === 1
            ? [
                <Button key="next" type="primary" onClick={handleNext} disabled={!selectedStatus}>
                  Continue
                </Button>,
              ]
            : step === 2 && isMissed
            ? [
                <Button key="back" onClick={handleBack}>
                  No
                </Button>,
                <Button key="confirm" type="primary" onClick={() => handleStatus("Missed")}>
                  Yes
                </Button>,
              ]
            : step === 2 && isModify
            ? [
                <Button key="back" onClick={handleBack}>
                  Previous
                </Button>,
                <Button key="next" type="primary" onClick={handleNext} disabled={!dateSelected}>
                  Continue
                </Button>,
              ]
            : step === 2 && isCancel
            ? [
                <Button key="back" onClick={handleBack}>
                  No
                </Button>,
                <Button key="confirm" type="primary" onClick={() => handleStatus("Cancelled")}>
                  Yes
                </Button>,
              ]
            : step === 2 && isSeen
            ? [
                <Button key="back" onClick={handleBack}>
                  Previous
                </Button>,
                <Button
                  key="next"
                  type="primary"
                  onClick={handleNext}
                  disabled={!selectedPaymentMethod}
                >
                  Next
                </Button>,
              ]
            : step === 3 && selectedPaymentMethod === "SSISA CREDITS"
            ? [
                <Button key="back" onClick={handleBack}>
                  Previous
                </Button>,
              ]
            : step === 3 && isModify
            ? [
                <Button key="back" onClick={handleBack}>
                  Previous
                </Button>,
                <Button key="confirm" type="primary" onClick={handleDateConfirmation}>
                  Confirm
                </Button>,
              ]
            : step === 4 && selectedPaymentMethod === "CASH/CARD"
            ? [
                <Button key="back" onClick={handleBackToPaymentMethod}>
                  No
                </Button>,
                <Button key="confirm" type="primary" onClick={handleClose}>
                  Yes
                </Button>,
              ]
            : []
        }
        width={1000}
      >
        {step === 1 && (
          <div className="statusOptions">
            <Button
              onClick={() => handleSelectedStatus("SEEN")}
              className={selectedStatus === "SEEN" ? "selected" : ""}
              disabled={props.appointmentStatus !== "Confirmed"}
            >
              SEEN
            </Button>
            <Button
              onClick={() => handleSelectedStatus("MISSED")}
              className={selectedStatus === "MISSED" ? "selected" : ""}
            >
              MISSED
            </Button>
            {props.appointmentStatus !== "Confirmed" && props.appointmentStatus !== "Seen" && (
              <Button
                onClick={() => handleSelectedStatus("MODIFY")}
                className={selectedStatus === "MODIFY" ? "selected" : ""}
              >
                CONFIRM
              </Button>
            )}
            <Button
              onClick={() => handleSelectedStatus("CANCELED")}
              className={selectedStatus === "CANCELED" ? "selected" : ""}
            >
              CANCEL
            </Button>
          </div>
        )}
        {step === 2 && isMissed && (
          <p>
            Are you sure you want to mark this appointment as{" "}
            <strong>{selectedStatus.toLowerCase()}</strong>?
          </p>
        )}
        {step === 2 && isModify && (
          <>
            <p>
              <strong>Client's Proposed Dates</strong>
            </p>
            <div>
              <strong>Date 1:</strong> {props.preferred_date1}, From{" "}
              {props.preferred_time_range1}
            </div>
            <div>
              <strong>Date 2:</strong> {props.preferred_date2}, From{" "}
              {props.preferred_time_range2}
            </div>
            <div>
              <strong>Date 3:</strong> {props.preferred_date3}, From{" "}
              {props.preferred_time_range3}</div>
            <br />
            <p style={{ color: "red", fontWeight: "bold", marginTop: "20px" }}>
              Please select your preferred date and time to continue:
            </p>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ my: 4 }}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate || null}
                  onChange={handleDateChange}
                  shouldDisableDate={(date) => shouldDisableDate(date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                &nbsp;
                <TimePicker
                  label="From"
                  value={timeRange.start || null}
                  onChange={(time) => handleTimeChange(time, "start")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                />
                &nbsp;
                <TimePicker
                  label="To"
                  value={timeRange.end || null}
                  onChange={(time) => handleTimeChange(time, "end")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                />
              </Box>
            </LocalizationProvider>
          </>
        )}
        {step === 2 && isCancel && (
          <p>
            Are you sure you want to <strong>cancel</strong> this appointment?
          </p>
        )}
        {step === 2 && isSeen && (
          <div className="specialistOptions">
            <Button
              onClick={() => handleSelectedPaymentMethod("CASH/CARD")}
              className={selectedPaymentMethod === "CASH/CARD" ? "selected" : ""}
            >
              CASH/CARD
            </Button>
            <Button
              onClick={() => handleSelectedPaymentMethod("SSISA CREDITS")}
              className={selectedPaymentMethod === "SSISA CREDITS" ? "selected" : ""}
            >
              SSISA CREDITS
            </Button>
          </div>
        )}
        {step === 3 && selectedPaymentMethod === "SSISA CREDITS" && (
          <div>
            <div className="confirmation">
              <p>The member has chosen to pay using SSISA Credits.</p>
              <p>Proceed to upload the invoice</p>
            </div>
            <UploadFiles
              handleClose={handleClose}
              AppointmentId={props.AppointmentId}
              memberId={id}
              total_credits_used={2}
              total_amount={0.0}
              paymentMethod={selectedPaymentMethod}
            />
          </div>
        )}
        {step === 4 && selectedPaymentMethod === "CASH/CARD" && (
          <div className="confirmation">
            <p>The member has chosen to pay by Card/Cash.</p>
            <p>Confirm this payment method?</p>
          </div>
        )}
        {step === 3 && isModify && (
          <>
            <h3>Appointment Details</h3>
            <div className="appointment-details">
              <p>
                <strong>Date:</strong> {dayjs(selectedDate).format("dddd, D MMMM YYYY")}
              </p>
              <p>
                <strong>Time:</strong> {dayjs(timeRange.start).format("HH:mm")} -{" "}
                {dayjs(timeRange.end).format("HH:mm")}
              </p>
            </div>
            <p>
              <em>
                Note: Confirming will send an SMS to the client with these details.
              </em>
            </p>
          </>
        )}
      </Modal>
    </>
  );
};