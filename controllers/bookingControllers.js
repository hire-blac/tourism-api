require('dotenv').config();
const Booking = require("../models/Bookings");
const User = require("../models/User");
const Activity = require("../models/activity");
const { sendMessage, getTextMessageInput, transporter } = require("../messageHelper");
const { StatusCodes } = require('http-status-codes');

const sender = process.env.SENDER;
const recipients = process.env.RECIPIENTS;

const sendEmail = (activity, booking, user) => {

  let mailOptions = {
    from: sender, // sender address
    to: recipients,
    subject: "New Booking", // Subject line
    html: `<h3>New Booking</h3>
    <p>
      <b>Client: </b>${user.firstname} ${user.lastname}<br>
      <b>Activity: </b>${activity.activityName}<br>
      <b>Num. of Adults: </b>${booking.numOfAdults}<br>
      <b>Num. of Children: </b>${booking.numOfChildren}<br>
      <b>Amount Paid: </b>${booking.amountPaid}<br>
      <b>Date: </b>${booking.date}<br>
      <b>Time: </b>${booking.time}
    </p>`
   }

  // send admin email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  // change email reciever
  mailOptions.to = user.email;

  // send user email
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

}

// function to send whatsapp message
const sendWhatsApp = (activity, booking, user) => {
  // set whatsapp message content
  let message = `New Booking \n********************\nClient: ${user.firstname} ${user.lastname}\nActivity: ${activity.activityName}\nNum. of Adults: ${booking.numOfAdults}\nNum. of Children: ${booking.numOfChildren}\nDate: ${booking.date}`;
  // send whataspp message
  let data = getTextMessageInput(process.env.RECIPIENT_WAID, message);
  
  sendMessage(data)
  .then(() => console.log("WhatsApp message sent"))
  .catch(err=>{
    console.log(err.response.data);
  });
}

// function to create a new booking
const makeNewBooking = async (booking, user) => {

  const {activityslug, numOfAdults, numOfChildren, amountPaid, date, time} = booking;

  try {
    // find activity
    const activity = await Activity.findOne({slug: activityslug});
    
    // create booking
    const newBooking = await Booking.create({
      user,
      activity,
      numOfAdults,
      numOfChildren,
      amountPaid,
      date,
      time
    })
    // send emails
    sendEmail(activity, newBooking, user);
  
    // send whatsapp message
    // sendWhatsApp(activity, newBooking, user);

    return newBooking;
    
  } catch (error) {
    return error
  }

}

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
  const bookings = req.body;
  // console.log(bookings);

  let allNewBookings = [];

  for (const booking of bookings) {
    try {
      const newBooking = await makeNewBooking(booking, user);

      console.log(newBooking);
      allNewBookings.push(newBooking);

    } catch (error) {
      console.log(error.message);
      res.json({
        bookings: allNewBookings,
        error: error.message
      }); 
    }
  }

  res.status(StatusCodes.OK).json({
    bookings: allNewBookings,
    message: "Bookings made successfully"
  });
}
