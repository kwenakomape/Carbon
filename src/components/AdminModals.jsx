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

export const AdminModals = (props) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isAttented, setiIsAttented] = useState(false);
  const [isMissed, setiIsMissed] = useState(false);
  const [isCancel, setIsCancel] = useState(false);
  const handleClose = () => {
    setOpen(false);
    setStep(1);
    setSelectedStatus(null);
    setSelectedPaymentMethod(null);
    setiIsMissed(false);
    setiIsAttented(false)
    setIsCancel(false);
    
  };
  const handlePayment = async () => {
    const id = props.memberId;
    try {
      await axios.get(`http://localhost:3001/api/paywith-credits/${id}`);
      handleClose();
      
    } catch (error) {
      console.error("Error Making Payment:", error);
    }
  }


  const handleSelectedStatus = (status) => {
    if (status === "MISSED") {
      setiIsMissed(true);
      setiIsAttented(false)
      setIsCancel(false)
      
    } else if (status === "CANCELED") {
      setiIsMissed(false);
      setiIsAttented(false)
      setIsCancel(true)
      
    }else if (status === "ATTEND"){
      setiIsMissed(false);
      setiIsAttented(true)
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
        size="tiny"
      >
        {step === 1 && (
          <>
            <ModalHeader className="status-modal-centered-header">
              Select Status
            </ModalHeader>
            <ModalContent>
              <div className="statusOptions">
                <Button
                  onClick={() => handleSelectedStatus("ATTEND")}
                  className={selectedStatus === "ATTEND" ? "selected" : ""}
                >
                  ATTEND
                </Button>
                <Button
                  onClick={() => handleSelectedStatus("MISSED")}
                  className={selectedStatus === "MISSED" ? "selected" : ""}
                >
                  MISSED
                </Button>
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
        {step === 2 && !isMissed && !isCancel && (
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
            <ModalActions className="centered-actions">
              <Button content="PAY" primary onClick={handlePayment} />
            </ModalActions>
          </>
        )}
        {step === 2 && selectedStatus && !isAttented && (
          <>
            <ModalHeader className="status-modal-centered-header">
              Confirm Action
            </ModalHeader>
            <ModalContent>
              <p>
                Are you sure you want to mark this appointment as <strong>{selectedStatus.toLowerCase()}</strong>?
              </p>
            </ModalContent>
            <ModalActions>
              <Button onClick={handleBack}>No</Button>
              <Button onClick={handleClose} primary>
                Yes
              </Button>
            </ModalActions>
          </>
        )}
      </Modal>
    </>
  );
};
