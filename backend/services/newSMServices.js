// const { Vonage } = require('@vonage/server-sdk')
import {Vonage} from "@vonage/server-sdk";
const vonage = new Vonage({
  apiKey: "4ee04f91",
  apiSecret: "qFAfTDpGsxD9edUa"
})


const from = "Vonage APIs"
const to = "27609442412"
const text = 'A text message sent using the Vonage SMS API'

async function sendSMS() {
    await vonage.sms.send({to, from, text})
        .then(resp => { console.log('Message sent successfully'); console.log(resp); })
        .catch(err => { console.log('There was an error sending the messages.'); console.error(err); });
}

sendSMS();