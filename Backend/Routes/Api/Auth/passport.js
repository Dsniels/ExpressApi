const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../User/user.model');

passport.use( 
    new GoogleStrategy({
        clientID : process.env.CLIENTE_ID,
        clientSecret : process.env.CLIENTE_SECRETE,
        callbackURL : '/api/users/google/callback',
        scope : ['profile', 'email']
    },
    (access_token, refresh_token, profile, done) => {
        User.findOne({googleId : profile.id})
            .then(user => {
              user ? done(null, user) : new User({
                googleId : profile.id, 
                name : profile.name, 
                email : profile.email
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





