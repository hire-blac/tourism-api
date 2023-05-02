require('dotenv').config();
const axios = require('axios');
const nodemailer = require('nodemailer');

const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASSWORD;
const emailHost = process.env.EMAIL_HOST;

// nodemailer transportter to send email
const transporter = nodemailer.createTransport({
  host: emailHost,
  secure: true,
  port: 465,
  auth: {
    user: emailUser,
    pass: emailPassword,
  },
});

// function to send whatsapp message
function sendMessage(data) {
  let config = {
    method: 'post',
    url: `https://graph.facebook.com/${process.env.VERSION}/${process.env.PHONE_NUMBER_ID}/messages`,
    headers: {
      'Authorization': `Bearer ${process.env.ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    },
    data: data
  };

  return axios(config)
}

function getTextMessageInput(recipient, text) {
  return JSON.stringify({
    "messaging_product": "whatsapp",
    "preview_url": false,
    "recipient_type": "individual",
    "to": recipient,
    "type": "text",
    "text": {
        "body": text
    }
  });
}

//google {
// "credential": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM5YWZkYTM2ODJlYmYwOWViMzA1NWMxYzRiZDM5Yjc1MWZiZjgxOTUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYmYiOjE2ODMwMjA1MTEsImF1ZCI6IjQwMjkzNjk4MzM3NC1jZ2lsY2toZzY0NXBmb2k4cmFtZ3M2cW5xMjA1Y3RuZC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsInN1YiI6IjEwMjcwNjYxMzc0MzU4OTQxMzg1MCIsImVtYWlsIjoiZW5pdGFucGV0ZXJzMjhAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF6cCI6IjQwMjkzNjk4MzM3NC1jZ2lsY2toZzY0NXBmb2k4cmFtZ3M2cW5xMjA1Y3RuZC5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbSIsIm5hbWUiOiJNaWNoYWVsIFBldGVyIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FHTm15eFlkUlJ1S2xiWkItMmRpZGI3ZjFSdVhCc0daaEJvQTlmRnVJLV9QPXM5Ni1jIiwiZ2l2ZW5fbmFtZSI6Ik1pY2hhZWwiLCJmYW1pbHlfbmFtZSI6IlBldGVyIiwiaWF0IjoxNjgzMDIwODExLCJleHAiOjE2ODMwMjQ0MTEsImp0aSI6IjA1NDgyN2M0OGEwNWZlZjdlMGMyYjBhNjRmOGMxMzk4MGQ1NjFmYWYifQ.tXVkU-H_iuEx2Jg_Ltrp-CncfjVptFVN9laIz3RSQU53fZyXpdGQR5Kb0QCZVA4MplIzH2bkVDzYmJNpVtxV-xPG8A6_Cs8_iOJSNaywYkyX6De5SA3p1PxrACTgghwchHVqq1BpcMeUaQnc7ezl93qESB0ClUDfR7OASdjIBo_dFUqlMzQdOjblzlvZ_gx5yQst5zWQTgTsqJBkPwIp62ULXLqQVdgbV2KQxCWs-pjo-XWKYuaTusuB-bxz2AI1K1WkOZSgpeyN_GVXnVNgD4WfleFq0MaaUV6s1cK72LCwVu8R_hfy7sJvizDPmRpkEogcp3N6-VhJJRFoa-d2bQ"
// }

//local eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDQ3ZDE5NzllMzMxMDljMDJmNTllYTQiLCJpYXQiOjE2ODMwMjA5NzYsImV4cCI6MTY4MzEwNzM3Nn0.N39F0zB4z4JKldev0cOKeTJZbnTtlaDMZ0A6rjpWdsw

// {
//   "activityslug": "evening-desert",
//   "numOfAdult": 2,
//   "numOfChildren": 0,
//   "date": "Thu May 11 2023",
//   "amountPaid": 1000
//   }

module.exports = {
  sendMessage,
  getTextMessageInput,
  transporter
};