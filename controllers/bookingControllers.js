const Booking = require("../models/Bookings");
const User = require("../models/User");
const Activity = require("../models/activity");
const { sendMessage, getTextMessageInput } = require("../messageHelper");
require('dotenv').config();

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
  const {firstname, lastname, email, country, activityslug} = req.body;
  const {numOfAdults, numOfChildren, amountPaid, date} = req.body;

  try {
    // check if user exists
    let user = await  User.findOne({email});
    if (!user) {
      // save user info
      user = await User.create({
        firstname,
        lastname,
        email,
        country
      });
    }

    // find activity
    const activity = await Activity.findOne({slug: activityslug});

    // save booking
    const booking = await Booking.create({
      user,
      activity,
      numOfAdults,
      numOfChildren,
      amountPaid,
      date
    })

    let message = `New Booking \n********************\nClient: ${user.firstname} ${user.lastname}\nActivity: ${activity.activityName}\nNum. of Adults: ${booking.numOfAdults}\nNum. of Children: ${booking.numOfChildren}\nDate: ${booking.date}`;

    // send email
    let data = getTextMessageInput(process.env.RECIPIENT_WAID, message);
    
    sendMessage(data)
    .then()
    .catch(function (error) {
      console.log(error);
      console.log(error.response.data);
    });

    res.json({booking});

  } catch (error) {
    res.json(error)
  }

}