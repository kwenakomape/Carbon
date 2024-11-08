import { Infobip, AuthType } from '@infobip-api/sdk';

const infobipClient = new Infobip({
  baseUrl: 'rp351y.api.infobip.com',
  apiKey: '4ef7b1a013e03cddf64daa67f82c15e5-f8dc5622-83e5-4578-bf50-26e64ebc1366',
  authType: AuthType.ApiKey,
});

const phoneNumbers = ['+27634364578']; // Example phone numbers from your database

phoneNumbers.forEach(async (number) => {
  const smsPayload = {
    messages: [
      {
        from: 'YourSenderID',
        destinations: [{ to: number }],
        text: '128',
      },
    ],
  };

  try {
    const response = await infobipClient.channels.sms.send(smsPayload);
    console.log('SMS sent successfully to', number, ':', response.data);
  } catch (error) {
    console.error('Error sending SMS to', number, ':', error);
  }
});

  