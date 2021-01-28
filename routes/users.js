const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model 
const User = require('../models/User');

//login Page 
router.get('/login', (req, res) =>  res.render('login'));

//Register Page 
router.get('/register', (req, res) =>  res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
  
    if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Please enter all fields' });
    }
  
    if (password != password2) {
      errors.push({ msg: 'Passwords do not match' });
    }
  
    if (password.length < 6) {
      errors.push({ msg: 'Password must be at least 6 characters' });
    }
  
    if (errors.length > 0) {
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2
      });
}else{
    //validation passed
    User.findOne({ email: email })
    .then(user => {
        if(user){
            //User exists
            errors.push({ msg: 'That email is already registed with a user' });
            res.render('register', {
                errors,
                name,
                email,
                password,
                password2
              });
        }else {
            const newUser = new User({
                name,
                email, 
                password

            });

            //hash the password 
            bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash)=>{
                if(err) throw err;
                // Set password to hashed password
                newUser.password = hash; 
                // Save User
                newUser.save()
                .then(user => {
                    req.flash('success_msg', 'You are now Registered and can login');
                    res.redirect('/users/login');
                })
                .catch(err =>  console.log(err));

            }))
        }
    });
}
});

// Login Handle
router.post('/login', (req, res, next) => {
passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/users/login',
  failureFlash: true
})(req, res, next);
});

//Logout Handle 
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are Logged out');
  res.redirect('/users/login');
})


module.exports = router;