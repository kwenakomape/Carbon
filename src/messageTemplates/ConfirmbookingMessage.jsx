import React from 'react';
import dayjs from 'dayjs';

export const ConfirmbookingMessage = ({ isDietitian, specialistName, selectedDate, timeRange, selectedSpecialist, selectedDates, timeRanges }) => {
  return isDietitian ? (
    <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
      <h2 className="text-xl font-bold mb-2">🎉 Success! Your appointment has been scheduled.</h2>
      <p className="mb-2"><strong>Details:</strong></p>
      <ul className="list-disc list-inside mb-2">
        <li><strong>Specialist:</strong> {specialistName} (Dietitian)</li>
        <li><strong>Date:</strong> {dayjs(selectedDate).format("dddd, D MMMM YYYY")}</li>
        <li><strong>Time:</strong> {dayjs(timeRange.start).format("HH:mm")}</li>
      </ul>
      <p>Thank you for choosing our services! We look forward to seeing you. 😊</p>
    </div>
  ) : (
    <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
      <h2 className="text-xl font-bold mb-2">🎉 Success! Your appointment request has been submitted.</h2>
      <p className="mb-2"><strong>Details:</strong></p>
      <ul className="list-disc list-inside mb-2">
        <li><strong>Specialist:</strong> {specialistName} ({selectedSpecialist})</li>
        {selectedDates.map((date, index) => (
          <li key={index}>
            <strong>Day {index + 1}:</strong> {dayjs(date).format("YYYY-MM-DD")} <strong>From:</strong> {dayjs(timeRanges[index].start).format("HH:mm")} <strong>To:</strong> {dayjs(timeRanges[index].end).format("HH:mm")}
          </li>
        ))}
      </ul>
      <p className="mb-2"><strong>Next Steps:</strong></p>
      <ul className="list-disc list-inside mb-2">
        <li>Your booking request is pending confirmation from the specialist based on their availability.</li>
        <li>You will receive a confirmation email and sms once the specialist approves your appointment.</li>
        <li>If the requested time is not available, we will contact you to reschedule.</li>
      </ul>
      <p>Thank you for choosing our services! We will keep you updated on the status of your booking. 😊</p>
    </div>
  );
};