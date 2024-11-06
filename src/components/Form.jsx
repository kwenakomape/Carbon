import "semantic-ui-css/semantic.min.css";
import { useNavigate } from 'react-router-dom';
import React, { useState } from "react";
import axios from 'axios';
import {
  FormField,
  Button,
  Icon,
  Form,
} from "semantic-ui-react";

export const LandingForm = () => {
  const [username, setUsername] = useState('');
  const [showPasswordField, setShowPasswordField] = useState(false);
  const [showOTPField, setShowOTPField] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [cell, setCell] = useState('');

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/check-username', { username });
      const { exists, type ,Cell} = response.data;
      
      if (type === 'email' && exists) {
        setShowPasswordField(true);
        setShowOTPField(false);
        setErrorMessage('');
      } else if (type === 'id' && exists) {
        setShowOTPField(true);
        setShowPasswordField(false);
        setErrorMessage('');
        setCell(Cell)
        await axios.post('http://localhost:3001/send-otp', { Cell });
      } else {
        setErrorMessage('Username does not exist');
      }
    } catch (error) {
      console.error('Error checking username:', error);
      setErrorMessage('An error occurred while checking the username');
    }
  };
    
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/verify-otp', { Cell:cell, otp });
      if (response.data.valid) {
        navigate('/dashboard');
      } else {
        setErrorMessage('Invalid OTP');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrorMessage('An error occurred while verifying the OTP');
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormField>
        <label>Username</label>
        <input
          placeholder="username"
          onChange={(e) => setUsername(e.target.value)}
        />
      </FormField>
      <FormField>
        {errorMessage && (
          <div className="username-error-alert">
            <span>
              <Icon name="exclamation triangle" size="Small" className="blinking-icon"/>
              <span>
                <strong>Error:</strong>
                {errorMessage}
              </span>
            </span>
          </div>
        )}
      </FormField>

      {!showPasswordField && !showOTPField && (
        <Button
          positive
          icon="chevron right"
          labelPosition="right"
          content="Next"
          type="submit"
        />
      )}
      {(showPasswordField || showOTPField) && (
        <>
          {showPasswordField && (
            <FormField>
              <label>Password</label>
              <input type="password" placeholder="Password" />
            </FormField>
          )}
          {showOTPField && (
            <FormField>
              <label>OTP</label>
              <input
                type="text"
                placeholder="OTP"
                onChange={(e) => setOtp(e.target.value)}
              />
            </FormField>
          )}
          <Button
            positive
            icon="chevron right"
            labelPosition="right"
            content="LOGIN"
            type="submit"
            onClick={handleLoginSubmit}
          />
        </>
      )}
    </Form>
  );
};
