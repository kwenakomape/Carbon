import React, { useState } from 'react';
import { Modal, Box, Button, TextField, Typography } from '@mui/material';

import { LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import AdapterDateFns from '@mui/lab/AdapterDateFns';

const AppointmentModal = ({ open, handleClose }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeRanges, setTimeRanges] = useState({});

  const handleDateChange = (date) => {
    if (selectedDates.length < 3 || selectedDates.includes(date)) {
      setSelectedDates((prev) => {
        const newDates = prev.includes(date)
          ? prev.filter((d) => d !== date)
          : [...prev, date];
        return newDates;
      });
    }
  };

  const handleTimeChange = (date, time, type) => {
    setTimeRanges((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [type]: time,
      },
    }));
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 1 }}>
        <Typography variant="h6">Book Appointment</Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {Array.from({ length: 3 }).map((_, index) => (
            <Box key={index} sx={{ my: 2 }}>
              <DatePicker
                label={`Select Date ${index + 1}`}
                value={selectedDates[index] || null}
                onChange={(date) => handleDateChange(date)}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              {selectedDates[index] && (
                <>
                  <TimePicker
                    label="Start Time"
                    value={timeRanges[selectedDates[index]]?.start || null}
                    onChange={(time) =>
                      handleTimeChange(selectedDates[index], time, 'start')
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                  <TimePicker
                    label="End Time"
                    value={timeRanges[selectedDates[index]]?.end || null}
                    onChange={(time) =>
                      handleTimeChange(selectedDates[index], time, 'end')
                    }
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </>
              )}
            </Box>
          ))}
        </LocalizationProvider>
        <Button variant="contained" onClick={handleClose}>
          Confirm
        </Button>
      </Box>
    </Modal>
  );
};

export default AppointmentModal;