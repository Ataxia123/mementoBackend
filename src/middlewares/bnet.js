import { config } from 'dotenv';
import passport from 'passport';
import { Strategy as BnetStrategy } from 'passport-bnet';
import refresh from 'passport-oauth2-refresh';
config();



const OAUTH_CALLBACK_URL = "http://memento-backend-cf191cb4715d.herokuapp.com/oauth/battlenet/callback";

// Review full list of available scopes here: https://develop.battle.net/documentation/guides/using-oauth
const OAUTH_SCOPES = process.env.OAUTH_SCOPES || "wow.profile";

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
//generate a random value for state management
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
const someval = makeid(5);

const strategy = new BnetStrategy(
  {
    clientID: process.env.BNET_ID,
    clientSecret: process.env.BNET_SECRET,
    scope: OAUTH_SCOPES,
    callbackURL: OAUTH_CALLBACK_URL,
    state: someval
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick(function() {

    });
    return done(null, profile);
  })

// Register the BnetStrategy within Passport.
passport.use(strategy);
refresh.use(strategy);


