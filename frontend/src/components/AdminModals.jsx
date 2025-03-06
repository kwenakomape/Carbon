import axios from "axios";
import dayjs from "dayjs";
import { Box, TextField, Typography,Select as MuSelect, MenuItem , InputLabel, FormControl} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers";
import { UploadFiles } from "./UploadFiles";
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from "react";
import { Modal, Select,Button,message,Dropdown } from "antd";
import { updateAppointmentStatus, updateNotesStatus } from '../../../backend/utils/apiUtils';

import { ExclamationCircleOutlined } from '@ant-design/icons';
import { AppointmentDetails } from "./AppointmentDetails";
import { NoteAlert } from "./Alert/NoteAlert";

export const AdminModals = (props) => {
  const id = props.memberId;

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isSeen, setIsSeen] = useState(false);
  const [isMissed, setIsMissed] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const [isAccept, setIsAccept] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeRange, setTimeRange] = useState({ start: null, end: null });
  const [dateSelected, setDateSelected] = useState(false);
  const [viewAppointmentDetails, SetViewAppointmentDetails] = useState(false);
  const [showUploadInvoiceModal, setShowUploadInvoiceModal] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [reschedule, setReschedule] = useState(false);
  const [notesCompleted,SetNotesCompleted] = useState(false);
   const [isreferral ,setIsreferral] = useState(false);
  const [actionType, setActionType] = useState(false);

  const names = [
    "Me",
    "Zoe Woodman",
    "Caitlin Miller",
    "Yusuf Kajee",
    "Jarrod Grunewald",
    "Lindiwe Le Brasseur",
    "Caitlin Miles",
    "Jana Burger",
    "Brittany Daniels",
  ];

  const handleChange = (value) => {
    setSelectedName(value);
    message.success(`Selected: ${value}`);
  };

  const items = [
    {
      key: "1",
      label: "Seen",
      onClick: () => {
        setOpen(true);
        handleSelectedStatus("SEEN");
        setStep(2);
      },
    },
    {
      key: "2",
      label: "Missed",
      onClick: () => {
        setOpen(true);
        handleSelectedStatus("MISSED");
        setStep(2);
      },
    },
    {
      key: "3",
      label: "View Details",
      onClick: () => {
        SetViewAppointmentDetails(true);
        setOpen(true);
      },
    },
    {
      key: "4",
      label: "Upload Invoice",
      onClick: () => {
        setOpen(true);
        setShowUploadInvoiceModal(true);
      },
    },
    {
      key: "5",
      label: "Make Payment",
      onClick: () => {
        setOpen(true);
        handleSelectedStatus("SEEN");
        setStep(2);
      },
    },
    {
      key: "6",
      label: "View Invoice",
      onClick: () => {
        setOpen(true);
      },
    },
    {
      key: "7",
      label: "Reschedule",
      onClick: () => {
        setReschedule(true);
        setActionType("Reschedule");
        setStep(2);
        setOpen(true);
      },
    },
    {
      key: "8",
      label: "Mark Notes as Completed",
      onClick: () => {
        SetNotesCompleted(true);
        setStep(2);
        setOpen(true);
      },
    },
    {
      key: "9",
      label: "Refer to Specialist",
      onClick: () => {
        setIsreferral(true)
        setStep(2);
        setOpen(true);
      },
    }
  ];

  const filteredItems = items.filter((item) => {
    if (
      props.appointmentStatus === "Pending" ||
      props.appointmentStatus === "Pending Reschedule"
    ) {
      return ["3", "7"].includes(item.key);
    } else if (
      props.appointmentStatus === "Cancelled" ||
      props.appointmentStatus === "Missed"
    ) {
      return ["3"].includes(item.key);
    } else if (props.appointmentStatus === "Confirmed") {
      return ["1", "2", "3", "7"].includes(item.key);
    } else if (props.appointmentStatus === "Seen") {
      // Add logic for "Mark Notes as Completed"
      if (item.key === "8") {
        // Only show "Mark Notes as Completed" if notes_status is "Not Started"
        return props.notes_status === "Not Started";
      }
  
      if (props.invoice_status === "INVOICE_PENDING") {
        if (props.payment_method !== "DEFERRED") {
          return !["1", "2", "5", "6", "7"].includes(item.key);
        }
        return !["1", "2", "6", "7"].includes(item.key);
      } else if (props.invoice_status === "INVOICE_UPLOADED") {
        if (props.payment_method !== "DEFERRED") {
          return !["1", "2", "5", "4", "7"].includes(item.key);
        }
        return !["1", "2", "4", "7"].includes(item.key);
      }
    }
  
    // Default return true for other cases
    return true;
  });
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

  const minTime = dayjs().set("hour", 5).set("minute", 29); // 5:30 AM
  const maxTime = dayjs().set("hour", 21).set("minute", 0); // 9:00 PM

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
    setSelectedName(null);
    setShowUploadInvoiceModal(false);
    SetViewAppointmentDetails(false);
    setIsAccept(false);
    setReschedule(false);
    SetNotesCompleted(false);
  };

  const handleStatus = async (status) => {
    await updateAppointmentStatus(
      id,
      props.AppointmentId,
      status,
      selectedPaymentMethod
    );
    handleClose();
    props.autoRefresh();
  };
  const handleNotesStatus = async (notesStatus) => {
    await updateNotesStatus(
      id,
      props.AppointmentId,
      notesStatus
    );
    handleClose();
    props.autoRefresh();
  };
  
  const handleDateConfirmation = async () => {
    let data = {
      memberId: id,
      memberName: props.memberName,
      appointmentId: props.AppointmentId,
      selectedDate: selectedDate,
      timeRange: timeRange,
      phoneNumber: props.phoneNumber,
      specialistName: (selectedName === "Me" || props.specialistType === "Physiotherapist") ? props.admin_name : selectedName,
      status: "Confirmed",
      role: props.role_id,
    };

    try {
      await axios.post("/api/confirm-date", data);
      handleClose();
      props.autoRefresh();
      message.success("Appointment Confirmed.");

      await axios.post("/api/send-appointment-details", data);
    } catch (error) {
      console.error("Error Confirming SMS:", error);
    }
  };

  const handleSelectedStatus = (status) => {
    if (status === "MISSED") {
      setIsMissed(true);
      setIsSeen(false);
      setIsCancel(false);
      setIsAccept(false);
    } else if (status === "CANCELED") {
      setIsMissed(false);
      setIsSeen(false);
      setIsCancel(true);
      setIsAccept(false);
    } else if (status === "SEEN") {
      setIsMissed(false);
      setIsSeen(true);
      setIsCancel(false);
      setIsAccept(false);
    } else if (status === "ACCEPT") {
      setIsMissed(false);
      setIsSeen(false);
      setIsAccept(true);
      setIsCancel(false);
    }
    setSelectedStatus(status);
  };

  const handleSelectedPaymentMethod = (paymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
  };
  const handleAppointmentActions = (status) => {
    setOpen(true);
    handleSelectedStatus(status);
    setStep(2);
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
    const isTimeRangeSelected =
      timeRange.start !== null && timeRange.end !== null;
    setDateSelected(isDateSelected && isTimeRangeSelected);
  }, [selectedDate, timeRange]);

  return (
    <>
      <div class="flex flex-wrap gap-2">
        {props.specialistId !== 2 &&
          (props.appointmentStatus === "Pending" ||
            props.appointmentStatus === "Pending Reschedule") && (
            <Button
              color="primary"
              size="small"
              variant="solid"
              onClick={() => handleAppointmentActions("ACCEPT")}
            >
              Accept
            </Button>
          )}
        {props.appointmentStatus !== "Cancelled" &&
          props.appointmentStatus !== "Missed" && (
            <div
              className="w-6 mr-2  transform hover:text-purple-500 hover:scale-110"
              onClick={() => handleAppointmentActions("CANCELED")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-full h-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </div>
          )}
        {(props.payment_method === "DEFERRED" ||
          props.appointmentStatus === "Confirmed" ||
          props.appointmentStatus === "Pending" ||
          props.appointmentStatus === "Missed" ||
          props.appointmentStatus === "Cancelled" ||
          props.appointmentStatus === "Pending Reschedule" ||
          props.appointmentStatus === "Seen") && (
          <>
            <Dropdown
              // placement="bottomRight"
              menu={{
                items: filteredItems,
              }}
            >
              <a>
                More <DownOutlined />
              </a>
            </Dropdown>
          </>
        )}
      </div>

      <Modal
        title={
          <div className="text-center w-full text-3xl font-bold text-blue-600">
            {step === 1 && viewAppointmentDetails
              ? "Full Details"
              : step === 2 && isMissed
              ? "Confirm Action"
              : step === 2 && (isAccept || reschedule)
              ? "Choose a Date and Time"
              : step === 2 && isCancel
              ? "Confirm Action"
              : step === 2 && isSeen
              ? "Select Payment Method"
              : step === 3 && (isAccept || reschedule)
              ? "Confirm Your Availability"
              : step === 3 && selectedPaymentMethod === "SSISA CREDITS"
              ? "Confirm Payment by SSISA Credits"
              : step === 3 && selectedPaymentMethod === "DEFERRED"
              ? "Confirm DEFFERED PAYMENT"
              : step === 4 && selectedPaymentMethod === "CASH/CARD"
              ? "Confirm Payment Method"
              : ""}
            {step === 1 && showUploadInvoiceModal && <div>Upload Invoice</div>}
            {step === 2 && notesCompleted && <div>Mark Notes as Completed</div>}
            {step === 2 && isreferral && <div>Make A refferal</div>}
            
          </div>
        }
        centered
        open={open}
        onCancel={handleClose}
        footer={
          step === 1 && !viewAppointmentDetails && !showUploadInvoiceModal
            ? [
                <Button
                  key="next"
                  type="primary"
                  onClick={handleNext}
                  disabled={!selectedStatus}
                >
                  Continue
                </Button>,
              ]
            : step === 2 && isMissed 
            ? [
                <Button key="back" onClick={handleBack}>
                  No
                </Button>,
                <Button
                  key="confirm"
                  type="primary"
                  onClick={() => {
                    handleStatus("Missed");
                    message.success("Appointment Missed.");
                  }}
                >
                  Yes
                </Button>,
              ]
            : step === 2 && notesCompleted
            ? [
                <Button key="back" onClick={handleBack}>
                  No
                </Button>,
                <Button
                  key="confirm"
                  type="primary"
                  onClick={() => {
                    handleNotesStatus("Completed");
                    message.success("Notes Completed.");
                  }}
                >
                  Yes
                </Button>,
              ]
            : step === 2 && (isAccept || reschedule)
            ? [
                <Button
                  key="next"
                  type="primary"
                  onClick={handleNext}
                  disabled={!dateSelected}
                >
                  Continue
                </Button>,
              ]
            : step === 2 && isCancel
            ? [
                <Button key="back" onClick={handleClose}>
                  No
                </Button>,
                <Button
                  key="confirm"
                  type="primary"
                  onClick={() => {
                    handleStatus("Cancelled");
                    props.autoRefresh();
                    message.success("Appointment Cancelled.");
                  }}
                >
                  Yes
                </Button>,
              ]
            : step === 2 && isSeen
            ? [
                <Button
                  key="next"
                  type="primary"
                  onClick={handleNext}
                  disabled={!selectedPaymentMethod}
                >
                  Next
                </Button>,
              ]
            : step === 3 && (isAccept || reschedule)
            ? [
                <Button key="back" onClick={handleBack}>
                  Previous
                </Button>,
                <Button
                  key="confirm"
                  type="primary"
                  onClick={handleDateConfirmation}
                >
                  Confirm
                </Button>,
              ]
            : (step === 4 && selectedPaymentMethod === "CASH/CARD") ||
              (step === 3 && selectedPaymentMethod === "SSISA CREDITS") ||
              (step === 3 && selectedPaymentMethod === "DEFERRED")
            ? [
                <Button key="back" onClick={handleBackToPaymentMethod}>
                  No
                </Button>,
                <Button
                  key="confirm"
                  type="primary"
                  onClick={() => handleStatus("SEEN")}
                >
                  Yes
                </Button>,
              ]
            : []
        }
        width={1000}
      >
        {viewAppointmentDetails && (
          <AppointmentDetails
            clientName={props.memberName}
            phoneNumber={props.phoneNumber}
            memberEmail={props.memberEmail}
            appointmentId={props.AppointmentId}
            confirmed_date={props.confirmed_date}
            confirmed_time={props.confirmed_time}
            credits_used={props.credits_used}
            appointmentStatus={props.appointmentStatus}
            preferred_date1={props.preferred_date1}
            preferred_time_range1={props.preferred_time_range1}
            preferred_date2={props.preferred_date2}
            preferred_time_range2={props.preferred_time_range2}
            preferred_date3={props.preferred_date3}
            preferred_time_range3={props.preferred_time_range3}
            specialistId={props.specialistId}
            specialistName={props.specialistName}
            notes_status={props.notes_status}
            roleId={props.role_id}
          />
        )}
        {showUploadInvoiceModal && (
          <UploadFiles
            handleClose={handleClose}
            AppointmentId={props.AppointmentId}
            AppointmentStatus={props.appointmentStatus}
            memberId={id}
            paymentMethod={selectedPaymentMethod}
            autorefresh={props.autoRefresh}
          />
        )}

        {step === 2 && notesCompleted && (
          <p className="text-xl">
            Please confirm that you have typed and saved your notes for this
            patient appointment on the SharePoint site.
            {/* <strong>{selectedStatus.toLowerCase()}</strong>? */}
          </p>
        )}
        {step === 2 && isMissed && (
          <p className="text-xl">
            Are you sure you want to mark this appointment as{" "}
            <strong>{selectedStatus.toLowerCase()}</strong>?
          </p>
        )}
        {step === 2 && (isAccept || reschedule) && (
          <>
            {reschedule && (
              <>
                <NoteAlert
                  description={
                    "Before confirming the new date and time for rescheduling, please contact the client to verify their availability. This ensures that the rescheduled appointment works for both parties and minimizes the risk of further changes."
                  }
                />
                <p>
                  <strong>Client Name:</strong> {props.memberName}
                </p>
                <p>
                  <strong>Phone Number:</strong> {props.phoneNumber}
                </p>
                <p>
                  <strong>Email:</strong> {props.memberEmail}
                </p>
                <p></p>
              </>
            )}
            {!reschedule && (
              <>
                <p className="text-lg mb-2">
                  <strong>Client's Proposed Dates</strong>
                </p>
                <div className="text-lg">
                  <strong>Date 1:</strong> {props.preferred_date1}, From{" "}
                  {props.preferred_time_range1}
                </div>
                <div className="text-lg">
                  <strong>Date 2:</strong> {props.preferred_date2}, From{" "}
                  {props.preferred_time_range2}
                </div>
                <div className="text-lg">
                  <strong>Date 3:</strong> {props.preferred_date3}, From{" "}
                  {props.preferred_time_range3}
                </div>
              </>
            )}
            {props.specialistType === "Biokineticist" && (
              <>
                <br />
                <div>
                  <Select
                    placeholder="Assign Task"
                    onChange={handleChange}
                    style={{ width: 200 }}
                    value={selectedName}
                    dropdownRender={(menu) => <>{menu}</>}
                  >
                    {names.map((name, index) => (
                      <Option key={index} value={name}>
                        <UserOutlined style={{ marginRight: 8 }} />
                        {name}
                      </Option>
                    ))}
                  </Select>
                </div>
              </>
            )}

            <br />
            {!reschedule ? (
              <p className="text-lg text-red-600 font-bold">
                Please select your preferred date and time to continue:
              </p>
            ) : (
              <p className="text-lg text-red-600 font-bold">
                Please select your new preferred date and time to continue:
              </p>
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Box sx={{ my: 4 }}>
                {reschedule ? (
                  <DatePicker
                    label="Select Date"
                    value={selectedDate || null}
                    onChange={handleDateChange}
                    shouldDisableDate={(date) => shouldDisableDate(date)}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                ) : (
                  <FormControl>
                    <InputLabel id="date-select-label">Select Date</InputLabel>
                    <MuSelect
                      labelId="date-select-label"
                      value={selectedDate || null}
                      onChange={(event) => handleDateChange(event.target.value)}
                      label="Select Date"
                      style={{ width: 246 }}
                    >
                      <MenuItem value={props.preferred_date1}>
                        {props.preferred_date1}
                      </MenuItem>
                      <MenuItem value={props.preferred_date2}>
                        {props.preferred_date2}
                      </MenuItem>
                      <MenuItem value={props.preferred_date3}>
                        {props.preferred_date3}
                      </MenuItem>
                    </MuSelect>
                  </FormControl>
                )}
                &nbsp;
                <TimePicker
                  label="From"
                  value={timeRange.start || null}
                  onChange={(time) => handleTimeChange(time, "start")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                &nbsp;
                <TimePicker
                  label="To"
                  value={timeRange.end || null}
                  onChange={(time) => handleTimeChange(time, "end")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                  minTime={minTime}
                  maxTime={maxTime}
                />
              </Box>
            </LocalizationProvider>
          </>
        )}
        {step === 2 && isCancel && (
          <p className="text-xl">
            <ExclamationCircleOutlined
              style={{ color: "red", marginRight: "8px" }}
            />
            Are you sure you want to <strong>cancel</strong> this appointment?
          </p>
        )}
        {step === 2 && isSeen && (
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
            <Button
              onClick={() => handleSelectedPaymentMethod("DEFERRED")}
              className={selectedPaymentMethod === "DEFERRED" ? "selected" : ""}
            >
              PAY LATER
            </Button>
          </div>
        )}
        {step === 3 && selectedPaymentMethod === "SSISA CREDITS" && (
          <div>
            <div className="confirmation">
              <p>The member has chosen to pay using SSISA Credits.</p>
              <p>Confirm this payment method</p>
            </div>
          </div>
        )}
        {step === 4 && selectedPaymentMethod === "CASH/CARD" && (
          <div className="confirmation">
            <p className="text-xl">The member has chosen to pay by Card/Cash.</p>
            <p className="text-xl">Confirm this payment method?</p>
          </div>
        )}
        {step === 3 && selectedPaymentMethod === "DEFERRED" && (
          <div className="confirmation">
            <p>The member has chosen to pay the session at later stage.</p>
            <p>Confirm to approve this?</p>
          </div>
        )}
        {step === 3 && (isAccept || reschedule) && (
          <>
            <div className="appointment-details">
              <p className="text-lg">
                <strong>Date:</strong>{" "}
                {dayjs(selectedDate).format("dddd, D MMMM YYYY")}
              </p>
              <p className="text-lg">
                <strong>Time:</strong> {dayjs(timeRange.start).format("HH:mm")}{" "}
                - {dayjs(timeRange.end).format("HH:mm")}
              </p>
              <p className="text-lg">
                <strong>{props.specialistType}:</strong>{" "}
                {props.specialistType !== "Physiotherapist"
                  ? selectedName === "Me"
                    ? props.admin_name
                    : selectedName || props.specialistName
                  : props.admin_name}
              </p>
            </div>
            <p>
              <em className="text-lg text-blue-600">
                Note: Confirming will send an SMS to the client with these
                details.
              </em>
            </p>
          </>
        )}
      </Modal>
    </>
  );
};