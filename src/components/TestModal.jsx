import React, { useState } from 'react';
import { Button } from '@mui/material';
import AppointmentModal from './AppointmentModal';

const TestModal = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  return (
    <div>
      
      <Button variant="contained" onClick={handleOpen}>
        Book Appointment
      </Button>
      <AppointmentModal open={modalOpen} handleClose={handleClose} />
    </div>
  );
};

export default TestModal