//calling in our dependencies
const express =require("express");
const axios=require("axios");
const dotenv=require("dotenv");
const session = require('express-session');
//const session= require("session");
const passport=require("passport");
const SpotifyStrategy = require('passport-spotify').Strategy

//load env variables, getting the env variables from the .env files
dotenv.config();


// Initialize Express app
const app = express();

//configure session middleware (enabling authentication and authorizaton, storing users data and returning users data when they log in)
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// configure passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport Spotify strategy
passport.use(new SpotifyStrategy({
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: '/auth/callback'
},
(accessToken, refreshToken, profile, done) => {
    //save user data session
    done(null, profile);
}
));

//serialize and deserialize user data (passwords into original format)
/**
 serialize; encoding data into a string, binary or other format from that can be transmitted or saved
 deserialize; converting serialized data back into its original form.
 */
passport.serializeUser((user, done) => {
    done(null, user);  //the null is used for error handling
});

passport.deserializeUser((user, done) =>{
    done(null, user) //the user is the actual user data that is being serialized or deserialized
})


// Serialize and deserialize user data
passport.serializeUser((user, done) => {
    //the null , user is used to pass the serialized or deserialized user data back to passport for further processing
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});


//let define our routes for the spotify
//the hoemepage button
app.get('/', (req, res)=>{   //the req is an object representing the HTTP request whiles the res is also repressenting the HTTP response
   res.send("Hey, fam!");
});

//the authentication page of the APP
app.get('/auth', passport.authenticate('spotify',{
    scope: ['user-read-private', 'user-read-email','playlist-modify-public']
}));

//callback page of the APP
app.get('/auth/callback', passport.authenticate('spotify'), (req, res)=>{
    //redirect us to the homepage if a user successful authenticate
    res.redirect('/'); //we called in the '/' button
});


//let start the server BY SETTING THE PORT TO 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`server listening on port ${PORT}`);
});

