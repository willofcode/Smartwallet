const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// session management is done by jwt hence serialize and deserialize method not required

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL,
  },
    // accessToken used to access the user's Google account
    // refreshToken used to refresh the access token
    // both is utilized to access other google services (calender, drive, contacts, etc.)
    // in this case its not an important factor and can be removed 
  async (accessToken, refreshToken, profile, done) => { 
    try {
      let user = await User.findOne({ email: profile.emails[0].value }); 
      if (!user) {
        user = await User.create({
          firstName: profile.name.givenName,
          lastName:  profile.name.familyName,
          email:     profile.emails[0].value,
          password:  profile.id, // Google ID as password
          emailVerified:  true,   // Google verified
        });
      }

      const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

      done(null, { user, token });
    } catch (err) {
      done(err, null);
    }
  }
));
