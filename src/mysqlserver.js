import express from 'express';
import mysql from 'mysql2';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Infobip, AuthType } from '@infobip-api/sdk';
import crypto from 'crypto';

const app = express();
app.use(bodyParser.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'carbondb'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

const infobipClient = new Infobip({
    baseUrl: 'rp351y.api.infobip.com',
    apiKey: '4ef7b1a013e03cddf64daa67f82c15e5-f8dc5622-83e5-4578-bf50-26e64ebc1366',
    authType: AuthType.ApiKey,
  });

const otpStore = new Map(); // Store OTPs temporarily

// Generate a random OTP
function generateOtp() {
  return crypto.randomInt(100000, 999999).toString();
}

// Send OTP to user's phone number
async function sendOtp(phoneNumber) {
  const otp = generateOtp();
  otpStore.set(phoneNumber, otp);

  try {
    const response = await infobipClient.channels.sms.send({
      type: 'text',
      messages: [
        {
          destinations: [{ to: phoneNumber }],
          from: 'YourSenderID',
          text: `Your OTP code is ${otp}`,
        },
      ],
    });
    console.log('OTP sent:', response.data);
    return true;
  } catch (error) {
    console.error('Error sending OTP:', error);
    return false;
  }
}

// Verify OTP
function verifyOtp(phoneNumber, otp) {
  const storedOtp = otpStore.get(phoneNumber);
  if (storedOtp === otp) {
    otpStore.delete(phoneNumber); // Remove OTP after verification
    return true;
  }
  return false;
}

app.post('/check-username', (req, res) => {
  const { username } = req.body;
  
  const checkEmailQuery = 'SELECT * FROM Admin WHERE Username = ?';
  const checkIDQuery = 'SELECT * FROM Member WHERE Id_No = ?';

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
    db.query(checkEmailQuery, [username], (err, results) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      res.send({ exists: results.length > 0, type: 'email' });
    });
  } else if (/^\d+$/.test(username)) {
    db.query(checkIDQuery, [username], (err, results) => {
      if (err) {
        return res.status(500).send('Database error');
      }
      if (results.length > 0) {
        const { Cell } = results[0];
        
        res.send({ exists: true, type: 'id', Cell: Cell });
      } else {
        res.send({ exists: false, type: 'id' });
      }
    });
  } else {
    res.send({ exists: false, type: 'invalid' });
  }
});

app.post('/send-otp', async (req, res) => {
  const { Cell } = req.body;
  const phoneNumber = Cell; // Assuming username is the phone number
  const success = await sendOtp(phoneNumber);
  if (success) {
    res.status(200).send('OTP sent successfully');
  } else {
    res.status(500).send('Failed to send OTP');
  }
});

app.post('/verify-otp', (req, res) => {
  const { Cell, otp } = req.body;
  const phoneNumber = Cell; // Assuming username is the phone number
  const isValid = verifyOtp(phoneNumber, otp);
  if (isValid) {
    res.status(200).send({ valid: true });
  } else {
    res.status(400).send({ valid: false });
  }
});

app.listen(3001, () => {
  console.log('Database server running on port 3001..');
});
