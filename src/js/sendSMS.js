import { Infobip, AuthType } from '@infobip-api/sdk';
const OTP = 1233;
const infobipClient = new Infobip({
  baseUrl: 'rp351y.api.infobip.com',
  apiKey: '4ef7b1a013e03cddf64daa67f82c15e5-f8dc5622-83e5-4578-bf50-26e64ebc1366',
  authType: AuthType.ApiKey,
});


try {
    const response = await infobipClient.channels.sms.send({
      type: 'text',
      messages: [
        {
          destinations: [{ to: '+27609442412' }],
          from: 'YourSenderID',
          text: OTP,
        },
      ],
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
  