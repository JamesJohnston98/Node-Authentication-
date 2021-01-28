const express = require('express');
const express_layout = require('express-ejs-layouts');

const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');


const app = express();

//Passport Configuration 
require('./config/passport')(passport);



//database configuration
const database = require('./config/keys').MongoURI;

//connect to the database
mongoose.connect(database, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('MongoDB Connected'))

.catch(err => console.log(err));




//EJS 
app.use(express_layout);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

// Express Session 
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }));

  //Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());





//Connect Flash 
app.use(flash());

// Global Variables 
app.use((req, res, next) =>  {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});


//Routes 
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;


app.listen(PORT, console.log(`Server Started on port ${PORT}`));