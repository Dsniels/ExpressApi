const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;


passport.use( 
    new GoogleStrategy({
        clientID : process.env.CLIENTE_ID,
        clientSecret : process.env.CLIENTE_SECRETE,
        callbackURL : '/api/users/google/callback',
        scope : ['profile', 'email']
    },
    (access_token, refresh_token, profile, callback) => {
        callback(null, profile);
    })    
  );


  passport.serializeUser((user, done) => {
    done(null,user);
  });

passport.deserializeUser((user, done) => {
    done(null,user);
});



