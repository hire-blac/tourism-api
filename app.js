require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {StatusCodes} = require('http-status-codes');
const activitiesRoutes = require('./routes/api/activitiesRoutes');
const serviceRoutes = require('./routes/api/servicesRoutes');


// .env variables
const API_PORT = 4000
// const port = process.env.PORT || API_PORT;
const port = 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://new-danihire:ruby5311@testingcluster.1iwpg.mongodb.net/tourism-api?retryWrites=true&w=majority';

// create express app
const app = express();

// connect to mongodb
mongoose.connect(MONGO_URI)
.then(res=> {
  console.log('Connected to database...');
  // listen for requests once database data has loaded
  app.listen(port, ()=>{
    console.log(`Server Listening for requests on port ${port}..`);
  })
})
.catch(err=>{
  console.log(err);
})


// register view engine
app.set('view engine', 'ejs');

// middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.options('*', cors()) // include before other routes

// unauthorized routes
app.get('/', (req, res) => {
  res.render('index');
})

// api routes
app.use(activitiesRoutes);
app.use(serviceRoutes);

// error handling middleware
// app.use((req, res, next) => {
//   const err = new Error('Not found');
//   err.status = 404;
//   next(err);
// });

app.use((req, res)=>{
  res.status(StatusCodes.NOT_FOUND).json({error: "Page Not Found"});
})