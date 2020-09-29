var passport = require("passport");

var GoogleStrategy = require("passport-google-oauth20").Strategy;
var keys = require('./keys');
var mongoose = require('mongoose');
// model
var User = mongoose.model('User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(
 new GoogleStrategy({
   clientID: keys.google.clientID,
   clientSecret: keys.google.clientSecret,
   callbackURL: '/api/auth/google/callback',
   proxy: true
  }, (accessToken, refreshToken, profile, done) => {
     // check if user already exists in our db
     //console.log(profile);
     User.findOne({googleId: profile.id}, function(err, currentUser) {
      if(currentUser) {
        // already have the user
        console.log('user is: ', currentUser);
        done(null, currentUser);
      } else {
        // if not, create user in our db
        new User({
          userName: profile.displayName,
          googleId: profile.id,
          userEmail: profile.emails[0].value,
          userImage: profile._json.picture
        }).save().then((newUser) => {
          console.log('new user created: ' + newUser);
          done(null, newUser);
       });
      }
     });
   
    }
));