import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker, DatePicker } from "@mui/x-date-pickers";
import { Button as AntButton, Modal, Dropdown, message, Alert, Space } from 'antd';
import { ExclamationCircleOutlined, DownOutlined } from '@ant-design/icons';
import dayjs from "dayjs";
import { ConfirmbookingMessage } from "../messageTemplates/ConfirmbookingMessage";
import { AlertMessage } from "./AlertMessage";
import { NoteAlert } from "./Alert/NoteAlert";
import { AppointmentDetails } from "./AppointmentDetails";

const STATUS_ACTIONS = {
  Pending: ['Modify', 'View Details'],
  'Pending Reschedule': ['Modify', 'View Details'],
  Cancelled: ['View Details'],
  Missed: ['View Details'],
  Seen: ['View Details'],
  Confirmed: ['Reschedule', 'View Details']
};

export const MemberModals = (props) => {
  const [state, setState] = useState({
    open: false,
    step: 1,
    isCancel: false,
    selectedSpecialist: null,
    selectedSpecialistID: null,
    specialistName: null,
    isDietitian: false,
    selectedDates: [null, null, null],
    selectedDate: null,
    timeRange: { start: null, end: null },
    timeRanges: [{ start: null, end: null }, { start: null, end: null }, { start: null, end: null }],
    datesSelected: false,
    showCreditModal: false,
    showUpdateModal: false,
    confirmLoading: false,
    showConfirmationModal: false,
    modify: false,
    viewAppointmentDetails: false,
    reschedule: false,
    actionType: null,
    confirmationMessage: ""
  });

  const setStateValue = (key, value) => {
    setState(prev => ({ ...prev, [key]: value }));
  };

  const items = [
    {
      key: '1',
      label: 'Reschedule',
      onClick: () => {
        setStateValue('reschedule', true);
        setStateValue('actionType', 'Reschedule');
        handleButtonClick(props.specialistId);
      }
    },
    {
      key: '2',
      label: 'Modify',
      onClick: () => {
        setStateValue('modify', true);
        setStateValue('actionType', 'Modify');
        handleButtonClick(props.specialistId);
      }
    },
    {
      key: '3',
      label: 'View Details',
      onClick: () => {
        setStateValue('viewAppointmentDetails', true);
        handleButtonClick(props.specialistId);
      }
    }
  ];

  const filteredItems = items.filter(item => 
    STATUS_ACTIONS[props.status]?.includes(item.label)
  );

  const handleBookingButtonClick = () => {
    setStateValue('actionType', 'Book');
    setStateValue('open', true);
  };

  const handleConfirmDate = (date) => {
    setStateValue('selectedDate', date);
    if (!state.timeRange.start) {
      setStateValue('timeRange', { start: null, end: null });
    }
  };

  const handleConfirmTime = (time, type) => {
    setStateValue('timeRange', prev => ({ ...prev, [type]: time }));
  };

  const handleDateChange = (date, index) => {
    const newDates = [...state.selectedDates];
    newDates[index] = date;
    setStateValue('selectedDates', newDates);
    
    const newTimeRanges = [...state.timeRanges];
    if (!newTimeRanges[index]) {
      newTimeRanges[index] = { start: null, end: null };
    }
    setStateValue('timeRanges', newTimeRanges);
  };

  const handleTimeChange = (index, time, type) => {
    const newTimeRanges = [...state.timeRanges];
    if (!newTimeRanges[index]) {
      newTimeRanges[index] = { start: null, end: null };
    }
    newTimeRanges[index][type] = time;
    setStateValue('timeRanges', newTimeRanges);
  };

  const minTime = dayjs().set("hour", 5).set("minute", 29);
  const maxTime = dayjs().set("hour", 21).set("minute", 0);

  const shouldDisableDate = (date, currentIndex) => {
    const today = dayjs().startOf("day");
    const day = dayjs(date).day();
    const isWeekend = day === 0 || day === 6;
    const isSelected = state.selectedDates.some((selectedDate, index) => (
      index !== currentIndex && selectedDate && dayjs(selectedDate).isSame(date, "day")
    ));
    const isBeforeToday = dayjs(date).isBefore(today);
    return isWeekend || isSelected || isBeforeToday;
  };

  const handleBack = () => {
    setStateValue('step', state.step - 1);
  };

  const handleConfirmationCloseModal = () => {
    setStateValue('showConfirmationModal', false);
    props.autoRefresh();
  };

  const handleClose = () => {
    setState({
      ...state,
      open: false,
      step: 1,
      selectedSpecialist: null,
      specialistName: null,
      isDietitian: false,
      isCancel: false,
      selectedDates: [null, null, null],
      timeRanges: [{ start: null, end: null }, { start: null, end: null }, { start: null, end: null }],
      selectedDate: null,
      timeRange: { start: null, end: null },
      datesSelected: false,
      modify: false,
      reschedule: false,
      viewAppointmentDetails: false
    });
  };

  const resetDatesAndTime = () => {
    setStateValue('selectedDates', [null, null, null]);
    setStateValue('timeRanges', [
      { start: null, end: null },
      { start: null, end: null },
      { start: null, end: null }
    ]);
  };

  const handleSpecialistSelect = (specialist) => {
    setStateValue('selectedSpecialist', specialist);
    if (specialist === "BIOKINETICIST") {
      resetDatesAndTime();
      setStateValue('selectedSpecialistID', 1);
      setStateValue('isDietitian', false);
    } else if (specialist === "DIETITIAN") {
      setStateValue('isDietitian', true);
    } else if (specialist === "PHYSIOTHERAPIST") {
      resetDatesAndTime();
      setStateValue('selectedSpecialistID', 3);
      setStateValue('isDietitian', false);
    }
  };

  const handleDietitianName = (name) => {
    setStateValue('selectedDate', null);
    setStateValue('timeRange', { start: null, end: null });
    setStateValue('selectedSpecialistID', name === 'NATASHA' ? 4 : 2);
    setStateValue('specialistName', name);
  };

  const handleNext = () => {
    const requiredCredits = state.selectedSpecialist === "DIETITIAN" ? 3 : 1;
    
    if (state.step === 1 && props.memberCredits < requiredCredits) {
      setStateValue('showCreditModal', true);
      return;
    }

    const nextStep = getNextStep();
    if (nextStep === 'handleBooking') {
      handleBooking();
    } else {
      setStateValue('step', nextStep);
    }
  };

  const getNextStep = () => {
    if (state.step === 1 && state.selectedSpecialist === "DIETITIAN") return 2;
    if (state.step === 2 && state.isDietitian) return 3;
    if (state.step === 2 && !state.isDietitian) return state.modify ? 'handleBooking' : 3;
    if (state.step === 3 && state.isDietitian) return 4;
    if (state.step === 3 && !state.isDietitian) return 'handleBooking';
    if (state.step === 4 && state.isDietitian) return 'handleBooking';
    return state.step + 1;
  };

  const handleAppointmentActions = () => {
    setStateValue('isCancel', true);
    setStateValue('open', true);
  };

  const handleStatus = async (status) => {
    try {
      await axios.patch(`/api/appointments/${props.appointment_id}/status`, { status });
      message.success('Appointment status updated successfully');
      handleClose();
      props.autoRefresh();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to update status');
      console.error('Status update error:', error);
    }
  };

  const handleBooking = async () => {
    setStateValue('confirmLoading', true);

    const bookingData = buildBookingData();

    try {
      await axios.post("/api/bookings", bookingData);
      
      setStateValue('confirmLoading', false);
      handleClose();

      const messageContent = (
        <ConfirmbookingMessage
          isDietitian={state.isDietitian}
          specialistName={state.specialistName || props.specialistName}
          selectedDate={state.selectedDate}
          timeRange={state.timeRange}
          selectedSpecialist={state.reschedule || state.modify ? props.specialistType : state.selectedSpecialist}
          actionType={state.actionType}
          selectedDates={state.selectedDates}
          timeRanges={state.timeRanges}
        />
      );

      setStateValue('confirmationMessage', messageContent);
      setStateValue('showConfirmationModal', true);
      setStateValue('showUpdateModal', false);
    } catch (error) {
      console.error("Booking error:", error);
      setStateValue('confirmLoading', false);
      message.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const buildBookingData = () => {
    const commonData = {
      memberId: props.memberId,
      memberName: props.memberName,
      specialistId: state.reschedule ? props.specialistId : state.selectedSpecialistID,
      specialistName: state.reschedule ? props.specialistName : state.specialistName,
      selectedSpecialist: state.reschedule || state.modify ? props.specialistType : state.selectedSpecialist,
      appointmentId: props.appointmentId,
      actionType: state.actionType,
      role: props.role_id,
      booking_type: props.setActionType === "Referral" ? "Referral" : "Standard",
      notes_status: "Not Started",
      status: state.reschedule ? "Pending Reschedule" : "Pending",
      booked_by: props.setActionType === "Referral" ? props.admin_name : props.memberName,
      initiator_id: props.setActionType === "Referral" ? props.admin_id : props.memberId
    };

    return state.isDietitian ? {
      ...commonData,
      timeRange: state.timeRange,
      selectedDate: state.selectedDate,
      type: "appointmentConfirmation"
    } : {
      ...commonData,
      timeRanges: state.timeRanges,
      selectedDates: state.selectedDates,
      type: "appointmentConfirmation"
    };
  };

  const handleButtonClick = (specialistId) => {
    setStateValue('isDietitian', specialistId === 2 || specialistId === 4);
    setStateValue('open', true);
  };

  useEffect(() => {
    const allDatesSelected = state.selectedDates.every(date => date !== null);
    const allTimesSelected = state.timeRanges.every(
      range => range.start !== null && range.end !== null
    );

    setStateValue('datesSelected', 
      state.isDietitian ? !!state.specialistName : (allDatesSelected && allTimesSelected)
    );
  }, [state.selectedDates, state.timeRanges, state.step, state.isDietitian, state.specialistName]);

  useEffect(() => {
    if (state.step === 1 && (state.reschedule || state.modify)) {
      setStateValue('step', props.specialistId === 2 || props.specialistId === 4 ? 3 : 2);
    }
  }, [state.reschedule, state.modify, state.step, props.specialistId]);

  const renderModalContent = () => {
    if (state.step === 1) {
      if (state.isCancel) {
        return (
          <p className="text-xl">
            <ExclamationCircleOutlined style={{ color: "red", marginRight: "8px" }} />
            Are you sure you want to <strong>cancel</strong> this appointment?
          </p>
        );
      }
      if (state.viewAppointmentDetails) {
        return (
          <AppointmentDetails
            clientName={props.memberName}
            phoneNumber={props.phoneNumber}
            memberEmail={props.memberEmail}
            appointmentId={props.appointment_id}
            confirmed_date={props.confirmed_date}
            confirmed_time={props.confirmed_time}
            credits_used={props.credits_used}
            appointmentStatus={props.status}
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
            booking_type={props.booking_type}
            booked_by={props.booked_by}
          />
        );
      }
      return (
        <div className="specialistOptions">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <AntButton
              onClick={() => handleSpecialistSelect("BIOKINETICIST")}
              className={`text-lg ${state.selectedSpecialist === "BIOKINETICIST" ? "selected" : ""}`}
              block
            >
              BIOKINETICIST
            </AntButton>
            <AntButton
              onClick={() => handleSpecialistSelect("DIETITIAN")}
              className={`text-lg ${state.selectedSpecialist === "DIETITIAN" ? "selected" : ""}`}
              block
            >
              DIETITIAN
            </AntButton>
            <AntButton
              onClick={() => handleSpecialistSelect("PHYSIOTHERAPIST")}
              className={`text-lg ${state.selectedSpecialist === "PHYSIOTHERAPIST" ? "selected" : ""}`}
              block
            >
              PHYSIOTHERAPIST
            </AntButton>
          </Space>
        </div>
      );
    }

    if (state.step === 2 && !state.isDietitian) {
      return (
        <>
          {state.modify ? (
            <p className="text-lg mb-2">
              Update/Change Your Selected <strong>Dates</strong> and
              <strong> time</strong> ranges
            </p>
          ) : (
            <p className="text-lg mb-2">
              Please select <strong>three</strong> dates and corresponding{" "}
              <strong>time</strong> ranges for your availability to continue
            </p>
          )}
          {state.reschedule && !state.modify && <AlertMessage />}
          {state.modify && (
            <>
              <NoteAlert description="Please ensure that the new dates and times you select do not conflict with any other commitments." />
              <p className="text-lg mb-2">
                <strong>Previous Selected Dates/Times:</strong>
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
              <p className="text-lg mt-4  text-orange-600">
                <strong>Please Enter New Dates/Times Below:</strong>
              </p>
            </>
          )}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {Array.from({ length: 3 }).map((_, index) => (
              <Box key={index} sx={{ my: 4 }}>
                <DatePicker
                  label={`Select Date ${index + 1}`}
                  value={state.selectedDates[index] || null}
                  onChange={(date) => handleDateChange(date, index)}
                  shouldDisableDate={(date) => shouldDisableDate(date, index)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
                &nbsp;
                <TimePicker
                  label="From"
                  value={state.timeRanges[index]?.start || null}
                  onChange={(time) => handleTimeChange(index, time, "start")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                  minTime={minTime}
                  maxTime={maxTime}
                />
                &nbsp;
                <TimePicker
                  label="To"
                  value={state.timeRanges[index]?.end || null}
                  onChange={(time) => handleTimeChange(index, time, "end")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                  ampm={false}
                  minTime={minTime}
                  maxTime={maxTime}
                />
              </Box>
            ))}
          </LocalizationProvider>
        </>
      );
    }

    if (state.step === 2 && state.isDietitian) {
      return (
        <div className="dietitianOptions">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <AntButton
              onClick={() => handleDietitianName("NATASHA")}
              className={`text-lg ${state.specialistName === "NATASHA" ? "selected" : ""}`}
              block
            >
              NATASHA
            </AntButton>
            <AntButton
              onClick={() => handleDietitianName("MARIE")}
              className={`text-lg ${state.specialistName === "MARIE" ? "selected" : ""}`}
              block
            >
              MARIE
            </AntButton>
          </Space>
        </div>
      );
    }

    if (state.step === 3 && state.isDietitian) {
      return (
        <>
          {state.reschedule && <AlertMessage />}
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
            block
          >
            Book a consultation with {state.specialistName || props.specialistName}
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
                value={state.selectedDate || null}
                onChange={handleConfirmDate}
                shouldDisableDate={(date) => shouldDisableDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              &nbsp;
              <TimePicker
                label="Selected Time"
                value={state.timeRange.start || null}
                onChange={(time) => handleConfirmTime(time, "start")}
                renderInput={(params) => <TextField {...params} fullWidth />}
                ampm={false}
                minTime={minTime}
                maxTime={maxTime}
              />
            </Box>
          </LocalizationProvider>
        </>
      );
    }

    if (state.step === 3 && !state.isDietitian) {
      return (
        <div className="memberDetails">
          <p className="text-lg font-semibold text-orange-600 mb-4">
            Please ensure all details are correct before proceeding with
            your booking.
          </p>

          <div>
            <strong>NAME:</strong> {props.memberName}
          </div>
          <div>
            <strong>SPECIALITY:</strong>{" "}
            {state.reschedule || state.modify
              ? props.specialistType
              : state.selectedSpecialist}
          </div>
          {state.selectedDates.map((date, index) => (
            <div key={index}>
              <strong>Day {index + 1}:</strong>{" "}
              {date ? dayjs(date).format("YYYY-MM-DD") : "N/A"}
              <strong>From:</strong>{" "}
              {state.timeRanges[index]?.start
                ? dayjs(state.timeRanges[index].start).format("HH:mm")
                : "N/A"}
              <strong>To:</strong>{" "}
              {state.timeRanges[index]?.end
                ? dayjs(state.timeRanges[index].end).format("HH:mm")
                : "N/A"}
            </div>
          ))}
        </div>
      );
    }

    if (state.step === 4 && state.isDietitian) {
      return (
        <div className="memberDetails">
          <p className="text-lg font-semibold text-orange-600 mb-4">
            Please ensure all details are correct before proceeding with
            your booking.
          </p>
          <div>
            <strong>NAME:</strong> {props.memberName}
          </div>
          <div>
            <strong>SPECIALITY:</strong>{" "}
            {state.reschedule ? props.specialistType : state.selectedSpecialist}
          </div>
          <div>
            <strong>Date:</strong>{" "}
            {dayjs(state.selectedDate).format("dddd, D MMMM YYYY")}
          </div>
          <div>
            <strong>Time:</strong> {dayjs(state.timeRange.start).format("HH:mm")}
          </div>
        </div>
      );
    }
  };

  const renderModalTitle = () => {
    if (state.step === 1) {
      if (state.isCancel) return "Confirm Action";
      if (state.viewAppointmentDetails) return "Full Details";
      return "Choose your Specialist";
    }
    if (state.step === 2) {
      if (!state.isDietitian) {
        return state.modify ? "MODIFY DATES AND TIME" : "CHOOSE THREE DATES";
      }
      return "CHOOSE A DIETITIAN";
    }
    if (state.step === 3) {
      return state.isDietitian ? "Book from this website" : "CONFIRM BOOKING";
    }
    return "CONFIRMED BOOKING DETAILS";
  };

  const renderModalFooter = () => {
    const footer = [];
    
    // Back button
    if (
      (state.step > 1 && !state.modify && !state.reschedule) ||
      (state.step > 2 && state.reschedule && !state.isDietitian) ||
      (state.step > 3 && state.reschedule && state.isDietitian)
    ) {
      footer.push(
        <AntButton key="back" onClick={handleBack}>
          Previous
        </AntButton>
      );
    }

    // Cancel action buttons
    if (state.step === 1 && state.isCancel) {
      footer.push(
        <AntButton key="back" onClick={handleClose}>
          No
        </AntButton>,
        <AntButton
          key="confirm"
          type="primary"
          onClick={() => {
            handleStatus("Cancelled");
            message.success("Appointment Cancelled.");
          }}
        >
          Yes
        </AntButton>
      );
    }

    // Next/Submit button
    if (!state.isCancel && !state.viewAppointmentDetails) {
      let buttonText = "Next";
      if ((state.step === 3 && !state.isDietitian) || (state.step === 4 && state.isDietitian)) {
        buttonText = state.step === 3 && !state.isDietitian ? "Book" : "Submit";
      } else if (state.step === 2 && !state.isDietitian && state.modify) {
        buttonText = "Update";
      }

      footer.push(
        <AntButton
          key="next"
          type="primary"
          onClick={
            (state.step === 3 && !state.isDietitian) || (state.step === 4 && state.isDietitian)
              ? handleBooking
              : handleNext
          }
          loading={
            (state.step === 3 && !state.isDietitian) || (state.step === 4 && state.isDietitian)
              ? state.confirmLoading
              : false
          }
          disabled={
            (state.step === 1 && !state.selectedSpecialist) ||
            (state.step === 2 && !state.datesSelected) ||
            (state.step === 2 && state.isDietitian && !state.specialistName) ||
            (state.step === 3 && state.isDietitian && (!state.selectedDate || !state.timeRange.start))
          }
        >
          {buttonText}
        </AntButton>
      );
    }

    return footer;
  };

  return (
    <>
      {props.modalType === "More Actions" && (
        <>
          {props.status !== "Cancelled" && props.status !== "Missed" && (
            <div className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={handleAppointmentActions}
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
          <Dropdown
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

      {props.modalType === "Book" && (
        <AntButton type="primary" onClick={handleBookingButtonClick}>
          BOOK APPOINTMENT
        </AntButton>
      )}

      {props.modalType === "Referral" && (
        <div
          className="w-6 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer"
          onClick={handleBookingButtonClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      )}

      <Modal
        title={<div className="text-center w-full text-3xl font-bold text-blue-600">{renderModalTitle()}</div>}
        centered
        open={state.open}
        onCancel={handleClose}
        footer={renderModalFooter()}
        width={1000}
      >
        {renderModalContent()}
      </Modal>

      <Modal
        title={
          <div className="text-2xl">
            <ExclamationCircleOutlined style={{ color: "red", marginRight: "8px" }} />
            Insufficient Credits
          </div>
        }
        centered
        open={state.showCreditModal}
        onCancel={() => setStateValue('showCreditModal', false)}
        footer={[
          <AntButton
            key="continue"
            type="primary"
            onClick={() => {
              setStateValue('showCreditModal', false);
              setStateValue('step', state.step + 1);
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
        open={state.showConfirmationModal}
        onCancel={handleConfirmationCloseModal}
        footer={[
          <AntButton
            key="close"
            type="primary"
            onClick={handleConfirmationCloseModal}
          >
            Close
          </AntButton>,
        ]}
      >
        <p>{state.confirmationMessage}</p>
      </Modal>

      <Modal
        title={<div className="text-2xl">Updating Appointment Details</div>}
        centered
        open={state.showUpdateModal}
        onCancel={() => {
          setStateValue('showUpdateModal', false);
          props.autoRefresh();
        }}
        footer={[
          <AntButton
            key="close"
            onClick={() => {
              setStateValue('showUpdateModal', false);
              props.autoRefresh();
            }}
          >
            No
          </AntButton>,
          <AntButton key="close" type="primary" onClick={handleBooking}>
            Yes
          </AntButton>,
        ]}
      >
        <p>Are you sure you want to update your appointment details?</p>
      </Modal>
    </>
  );
};

export default MemberModals;