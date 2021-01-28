const LocalStrategy = require('passport-local').Strategy;

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');


//Load the user
const User = require('../models/User');


module.exports = function(passport){ 
    passport.use(
        new LocalStrategy({ usernameField: 'email'}, (email, password, done) => {
            //Match the user 
            User.findOne({ email: email })
            .then(user => {
                if(!user){
                    return done(null, false, { message: 'That Email is not registered with us' });
                }

                // Check the password matches what is stored 
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if(err) throw err;

                    if(isMatch){
                        return done(null, user);
                    }else {
                        return done(null, false, { message: 'Password entered cannot be found in our records' });
                    }
                });
            })
            .catch(err => console.log(err) );
        })
    );
    passport.serializeUser((user, done) =>{
        done(null, user.id);
      });
      
      passport.deserializeUser((id, done) =>{
        User.findById(id, function(err, user) {
          done(err, user);
        });
      });

}
