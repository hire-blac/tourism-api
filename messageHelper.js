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

module.exports = {
  sendMessage,
  getTextMessageInput,
  transporter
};