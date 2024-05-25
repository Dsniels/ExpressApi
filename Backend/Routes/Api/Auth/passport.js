const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../User/user.model');
require('dotenv').config();

passport.use( 
    new GoogleStrategy({
        clientID : process.env.CLIENT_ID,
        clientSecret : process.env.CLIENTE_SECRETE,
        callbackURL : 'http://localhost:3000/api/users/google/callback',
        scope : ['profile', 'email']
    },
    (access_token, refresh_token, profile, done) => {
        User.findOne({googleId : profile.id})
            .then(user => {
              user ? done(null, user) : new User({
                googleId : profile.id, 
              })
                .save()
                .then(user=>done(null, user));
            })
    })    
  );


  passport.serializeUser((user, done) => {
    done(null,user.id);
  });

passport.deserializeUser((id, done) => {
    User.findById(id).then(user => done(null, user));
});





