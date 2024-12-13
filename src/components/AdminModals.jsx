import {
  PDFDownloadLink,
} from "@react-pdf/renderer";
import {
  ModalHeader,
  ModalContent,
  ModalActions,
  Button,
  Icon,
  Modal,
} from "semantic-ui-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { Box, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import { Invoice} from "./Invoice";


export const AdminModals = (props) => {
  const id = props.memberId;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isSeen, setiIsSeen] = useState(false);
  const [isMissed, setiIsMissed] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isModify, setIsModify] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const [dateSelected, setDateSelected] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfName, setPdfName] = useState('');
  const [invoiceDetails, setinvoiceDetails] = useState('');
  const [remainingCredits, setRemainingCredits] = useState(0);
  const [pdfEmailAttach, setPdfEmailAttach] = useState(null);
  

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
    setiIsMissed(false);
    setiIsSeen(false);
    setIsCancel(false);
    setSelectedDate(null);
    setTimeRange({ start: null, end: null })
  };

  const UpdateAppointmentStatus = async (status) => {
    let data = {
      memberId : id,
      newStatus:status,
      AppointmentId:props.AppointmentId,
   }
    try {
      await axios.post(`http://localhost:3001/api/update-appointment-status`,data);
    } catch (error) {
      console.error("Error Updating Appoinment status", error);
    }
  }
  const handletStatus = async (status) => {
    await UpdateAppointmentStatus(status);
    handleClose();
  }

  const handleDateConfirmation = async () => {

    let data = {
       memberId : id,
       memberName:props.memberName,
       appointmentId:props.AppointmentId,
       selectedDate : selectedDate,
       timeRange: timeRange,
       phoneNumber: props.phoneNumber,
    }
 
    try {
      await axios.post("http://localhost:3001/api/confirm-date", data);
      handleClose();

      await axios.post("http://localhost:3001/api/send-appointment-details", data);
      
    } catch (error) {
      console.error("Error Cofirming sms:", error);
    }
  }
  const sendInvoiceEmail = async () => {

    let data ={
      type:"invoiceEmail",
      invoiceDetails:invoiceDetails,
      paymentMethod:selectedPaymentMethod,
      remainingCredits:remainingCredits,
      pdfEmailAttach:pdfEmailAttach,
    }
    try {

      await axios.post("http://localhost:3001/api/send-email", data);
      handleClose();
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  }
  const handleSelectedStatus = (status) => {
    if (status === "MISSED") {
      setiIsMissed(true);
      setiIsSeen(false)
      setIsCancel(false)
      setIsModify(false)
      
    } else if (status === "CANCELED") {
      setiIsMissed(false);
      setiIsSeen(false)
      setIsCancel(true)
      setIsModify(false)
      
    }else if (status === "SEEN"){
      setiIsMissed(false);
      setiIsSeen(true)
      setIsCancel(false)
      setIsModify(false)
    }else if (status === "MODIFY"){
      setiIsMissed(false);
      setiIsSeen(false)
      setIsModify(true)
      setIsCancel(false)
    }
    setSelectedStatus(status);
  };
  const handleSelectedPaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };
  const handleNext = () => {
    setStep(step + 1);
  };
  const handleBack = () => {
    setStep(step - 1);
  };

  useEffect(() => {
    const isDateSelected = selectedDate !== null;
    const isTimeRangeSelected =
      timeRange.start !== null && timeRange.end !== null;
    setDateSelected(isDateSelected && isTimeRangeSelected);
  }, [selectedDate, timeRange]);
  return (
    <>
      <Icon
        className="ellipsisIcon"
        onClick={() => setOpen(true)}
        name="ellipsis horizontal"
        size="large"
      />
      <Modal
        closeIcon
        onClose={step === 2 ? handleBack : handleClose}
        open={open}
        closeOnDimmerClick={false}
        size="small"
      >
        {step === 1 && (
          <>
            <ModalHeader className="status-modal-centered-header">
              Select Status
            </ModalHeader>
            <ModalContent>
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
                {(props.appointmentStatus !== "Confirmed" && props.appointmentStatus !== "Seen")  && <Button
                  onClick={() => handleSelectedStatus("MODIFY")}
                  className={selectedStatus === "MODIFY" ? "selected" : ""}
                  
                >
                  CONFIRM
                </Button>}
                <Button
                  onClick={() => handleSelectedStatus("CANCELED")}
                  className={selectedStatus === "CANCELED" ? "selected" : ""}
                >
                  CANCEL
                </Button>
              </div>
            </ModalContent>
            <ModalActions>
              <Button onClick={handleNext} primary disabled={!selectedStatus}>
                Continue
                <Icon name="right chevron" />
              </Button>
            </ModalActions>
          </>
        )}
        {step === 2 && isMissed && (
          <>
            <ModalHeader className="status-modal-centered-header">
              Confirm Action
            </ModalHeader>
            <ModalContent>
              <p>
                Are you sure you want to mark this appointment as{" "}
                <strong>{selectedStatus.toLowerCase()}</strong>?
              </p>
            </ModalContent>
            <ModalActions>
              <Button onClick={handleBack}>No</Button>
              <Button onClick={() => handletStatus("Missed")} primary>
                Yes
              </Button>
            </ModalActions>
          </>
        )}
        {step === 2 && isModify && (
          <>
            <ModalHeader id="calender-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>Choose a Date and Time</span>
            </ModalHeader>
            <ModalContent>
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
                {props.preferred_time_range3}
              </div>
              <br />
              <p style={{ color: 'red', fontWeight: 'bold', marginTop: '20px' }}>
    Please select your preferred date and time to continue:
  </p>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                {" "}
                <Box sx={{ my: 4 }}>
                  {" "}
                  <DatePicker
                    label="Select Date"
                    value={selectedDate || null}
                    onChange={handleDateChange}
                    shouldDisableDate={(date) => shouldDisableDate(date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />{" "}
                  &nbsp;{" "}
                  <TimePicker
                    label="From"
                    value={timeRange.start || null}
                    onChange={(time) => handleTimeChange(time, "start")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    ampm={false}
                  />{" "}
                  &nbsp;{" "}
                  <TimePicker
                    label="To"
                    value={timeRange.end || null}
                    onChange={(time) => handleTimeChange(time, "end")}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                    ampm={false}
                  />{" "}
                </Box>{" "}
              </LocalizationProvider>
            </ModalContent>
            <ModalActions>
              <Button onClick={handleNext} primary disabled={!dateSelected}>
                Continue
                <Icon name="right chevron" />
              </Button>
            </ModalActions>
          </>
        )}
        {step === 2 && isCancel && (
          <>
            <ModalHeader className="status-modal-centered-header">
              Confirm Action
            </ModalHeader>
            <ModalContent>
              <p>
                Are you sure you want to <strong>cancel</strong> this
                appointment ?
              </p>
            </ModalContent>
            <ModalActions>
              <Button onClick={handleBack}>No</Button>
              <Button onClick={() => handletStatus("Cancelled")} primary>
                Yes
              </Button>
            </ModalActions>
          </>
        )}
        {step === 2 && isSeen && (
          <>
            <ModalHeader id="calender-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>Select Payment Method</span>
            </ModalHeader>
            <ModalContent>
              <div className="specialistOptions">
                <Button
                  onClick={() => handleSelectedPaymentMethod("CASH/CARD")}
                  className={
                    selectedPaymentMethod === "CASH/CARD" ? "selected" : ""
                  }
                >
                  CASH/CARD
                </Button>
                <Button
                  onClick={() => handleSelectedPaymentMethod("SSISA CREDITS")}
                  className={
                    selectedPaymentMethod === "SSISA CREDITS" ? "selected" : ""
                  }
                >
                  SSISA CREDITS
                </Button>
              </div>
            </ModalContent>
            <ModalActions>
              <Button
                content="Next"
                primary
                disabled={!selectedPaymentMethod}
                onClick={handleNext}
              />
            </ModalActions>
          </>
        )}
        {step === 3 && selectedPaymentMethod && (
          <>
            <ModalHeader id="calender-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>
                {selectedPaymentMethod === "CASH/CARD"
                  ? "Confirm Payment by Card"
                  : "Confirm Payment by SSISA Credits"}
              </span>
            </ModalHeader>
            <ModalContent>
              <div>
                {selectedPaymentMethod === "CASH/CARD" ? (
                  <div className="confirmation">
                    <p>The member has chosen to pay by Card/Cash.</p>
                    <p>
                      Proceed to generate the invoice and confirm the session.
                    </p>
                  </div>
                ) : (
                  <div className="confirmation">
                    <p>The member has chosen to pay using SSISA Credits.</p>
                    <p>
                      Proceed to generate the invoice, deduct credits from the
                      member's account, and confirm the session.
                    </p>
                  </div>
                )}
              </div>
            </ModalContent>
            <ModalActions className="centered-actions">
              <Invoice
                paymentMethod={selectedPaymentMethod}
                handleNext={handleNext}
                setPdfUrl={setPdfUrl}
                AppointmentId={props.AppointmentId}
                memberId={id}
                total_credits_used={props.total_credits_used}
                total_amount={props.total_amount}
                setPdfName={setPdfName}
                setinvoiceDetails={setinvoiceDetails}
                setRemainingCredits={setRemainingCredits}
                setPdfEmailAttach={setPdfEmailAttach}
                UpdateAppointmentStatus={UpdateAppointmentStatus}
              />
            </ModalActions>
          </>
        )}
        {step === 4 && selectedPaymentMethod && (
          <>
            <ModalHeader id="calender-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>Invoice Generated</span>
            </ModalHeader>
            <ModalContent>
              <>
                <p>Invoice generated. You can now send it to the member.</p>{" "}
                Download{" "}
                {pdfUrl && (
                  <a href={pdfUrl} download={pdfName}>
                    {pdfName}
                  </a>
                )}
                <br />
                <br />
                <div>
                  <iframe src={pdfUrl} width="100%" height="450px"></iframe>
                </div>
              </>
            </ModalContent>
            <ModalActions className="centered-actions">
              <Button primary onClick={sendInvoiceEmail}>
                Send Invoice
              </Button>
            </ModalActions>
          </>
        )}
        {step === 3 && isModify && (
          <>
            <ModalHeader id="adminConfirmDate-modal-centered-header">
              <Button
                icon="left chevron"
                content="Previous"
                onClick={handleBack}
              />
              <span>Confirm Your Availablity</span>
            </ModalHeader>
            <ModalContent>
              <h3>Appointment Details</h3>
              <div class="appointment-details">
                <p>
                  <strong>Date:</strong>{" "}
                  {dayjs(selectedDate).format("dddd, D MMMM YYYY")}
                </p>
                <p>
                  <strong>Time:</strong>{" "}
                  {dayjs(timeRange.start).format("HH:mm")} -{" "}
                  {dayjs(timeRange.end).format("HH:mm")}
                </p>
              </div>
              <p>
                <em>
                  Note: Confirming will send an SMS to the client with these
                  details.
                </em>
              </p>
            </ModalContent>
            <ModalActions className="centered-actions">
              <Button onClick={handleDateConfirmation} primary>
                Confirm
              </Button>
            </ModalActions>
          </>
        )}
      </Modal>
    </>
  );
};
