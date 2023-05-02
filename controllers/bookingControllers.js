require('dotenv').config();
const Booking = require("../models/Bookings");
const User = require("../models/User");
const Activity = require("../models/activity");
const { sendMessage, getTextMessageInput, transporter } = require("../messageHelper");

const sender = process.env.SENDER;
const recipients = process.env.RECIPIENTS;

let adminMailOptions = {
  from: sender, // sender address
  to: recipients,
  subject: "New Booking", // Subject line
 };

let clientMailOptions = {
  from: sender, // sender address
  subject: "New Booking", // Subject line
 };


// list all bookings
module.exports.allBookings = async (req, res) => {
  Booking.find().populate('user').populate('activity').sort({createdAt: -1, _id: -1})
  .then(bookings => res.json(bookings))
  .catch(err => res.json(err));
}

// get single booking
module.exports.getBooking = async (req, res) => {
  Booking.find().populate('user')
  .then(booking => {
    res.json(booking)
  })
  .catch(err => res.json(err));
}

// create booking
module.exports.get_createBooking = async (req, res) => {
  const activities = await Activity.find();

  res.render('booking', {activities});
}


// create a new booking
module.exports.createBooking = async (req, res)=>{
  const user= req.user;
  const activities = req.body;

  try {
    // find activity
    for (const i of activities) {

      const {activityslug, numOfAdults, numOfChildren, amountPaid, date} = i;

      const activity = await Activity.findOne({slug: activityslug});

      // create booking
      Booking.create({
        user,
        activity,
        numOfAdults,
        numOfChildren,
        amountPaid,
        date
      }).then(booking => {
  
        // set admin email content
        adminMailOptions.html = `<h3>New Booking</h3>
        <p>
        <b>Client: </b>${user.firstname} ${user.lastname}<br>
        <b>Activity: </b>${activity.activityName}<br>
        <b>Num. of Adults: </b>${booking.numOfAdults}<br>
        <b>Num. of Children: </b>${booking.numOfChildren}<br>
        <b>Amount Pait: </b>${booking.amountPaid}<br>
        <b>Date: </b>${booking.date}
        </p>`;
  
        // set client email content
        clientMailOptions.to = user.email;
        clientMailOptions.html = `<h3>New Booking</h3>
        <p>
        <b>Client: </b>${user.firstname} ${user.lastname}<br>
        <b>Activity: </b>${activity.activityName}<br>
        <b>Num. of Adults: </b>${booking.numOfAdults}<br>
        <b>Num. of Children: </b>${booking.numOfChildren}<br>
        <b>Amount Pait: </b>${booking.amountPaid}<br>
        <b>Date: </b>${booking.date}
        </p>`;
  
        // send admin email
        transporter.sendMail(adminMailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
  
        // send client email
        transporter.sendMail(clientMailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
  
        // set whatsapp message content
        let message = `New Booking \n********************\nClient: ${user.firstname} ${user.lastname}\nActivity: ${activity.activityName}\nNum. of Adults: ${booking.numOfAdults}\nNum. of Children: ${booking.numOfChildren}\nDate: ${booking.date}`;
        // send whataspp message
        let data = getTextMessageInput(process.env.RECIPIENT_WAID, message);
        
        sendMessage(data)
        .then(() => console.log("WhatsApp message sent"))
        .catch(err=>{
          console.log(err.response.data);
        });
    
        res.json({booking});
    
      }).catch (err=>{
        res.json(err)
      });
      
    }
  
  } catch (error) {
    res.json(error)
  }
}
