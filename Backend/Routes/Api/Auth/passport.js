const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('../User/user.model');
const { signToken } = require('./auth.service');
require('dotenv').config();

passport.use( 
    new GoogleStrategy({
        clientID : process.env.CLIENT_ID,
        clientSecret : process.env.CLIENTE_SECRETE,
        callbackURL : `${process.env.BASE_URL}/api/users/google/callback`,
        scope : ['profile', 'email'],
        passReqToCallback : true
    },
    async (request, accessToken, refreshToken, profile, done) => {
      try {
        // Aquí puedes verificar o crear el usuario en tu base de datos
        let user = await User.findOne({ 
          googleId: profile.id 
        });
        
        if (!user) {
          user = new User({ 
            googleId: profile.id, 
            name: profile.given_name, 
            lastname : profile.family_name ,
            email: profile.email,
            image : profile.photos[0].value
          });

        }
        const payload = {
            GoogleId : user.googleId,
            role : user.role
          }
          user.token = signToken(payload)
          await user.save();
          
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }})    
);
passport.serializeUser((user, done) => {
  console.log("🚀 ~ user:", user)
  done(null, user);
});

// deserialize the cookieUserId to user in the database
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      console.log("🚀 ~ passport.deserializeUser ~ user:", user)
      done(null, user);
    })
    .catch(e => {
      done(new Error("Failed to deserialize an user"));
    });
});



/* 
passport.serializeUser((user, done) => {
    done(null,user.id);
  });

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
}); */





