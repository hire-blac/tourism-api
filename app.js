require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {StatusCodes} = require('http-status-codes');
const activitiesRoutes = require('./routes/api/activitiesRoutes');
const adminRoutes = require('./routes/admin/adminRoutes');
const serviceRoutes = require('./routes/api/servicesRoutes');
const bookingRoutes = require('./routes/api/bookingRoutes');
const userRoutes = require('./routes/api/userRoutes');
const { checkAdmin } = require('./middlewares/requireAuth');

// .env variables
const API_PORT = 4000
const port = process.env.PORT || API_PORT;

const DB_URI = process.env.DB_URI

// create express app
const app = express();

// connect to mongodb
mongoose.connect(DB_URI)
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

let whitelist = [
  'http://127.0.0.1:5173', 
  'http://localhost:5173', 
  'http://127.0.0.1:5174', 
  'http://localhost:4000',
  'https://arabiens.pages.dev',
  'https://arabianlens.com',
  'https://api.arabianlens.com'
]

let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}

// middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.options('*', cors()) // include before other routes

// unauthorized routes
app.get('/', (req, res) => {
  res.render('index');
})

// unauthorized routes
app.get('/token-check', (req, res) => {
  
  if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[1]) {
    const token = req.headers.authorization.split(' ')[1];
    
    // console.log(token);
    const decodedToken = jwt.verify(token, tokenKey)
    if (decodedToken) res.json({tokenValid: true})
    else  res.json({tokenValid: false})

  } else {
    res.status(403).send({
      message: 'Authorization Bearer Token header is required'
    })
  }
})

// admin auth routes
// app.get('/admin/*', checkAdmin);
app.use('/admin', adminRoutes);

// api routes
app.use(activitiesRoutes);
app.use(serviceRoutes);
app.use(bookingRoutes);
app.use('/api', userRoutes);

app.use((req, res)=>{
  res.status(StatusCodes.NOT_FOUND).json({error: "Page Not Found"});
})