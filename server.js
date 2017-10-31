const express = require('express'),
      bodyParser = require('body-parser'),
      cookieParser = require('cookie-parser'),
      cookieSession = require('cookie-session'),
      passport = require('passport'),
      twitchStrategy = require('passport-twitch').Strategy;

const config = require('./config.json');


const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}))
    .use(cookieParser())
    .use(cookieSession({secret:"keep this string a secret!"}))
    .use(passport.initialize())
    .use(express.static("./public"));

passport.use(new twitchStrategy({
    clientID: config.clientID,
    clientSecret: config.clientSecret,
    callbackURL: "http://localhost:3000/logged",
    scope: "user_read"
}, function(accessToken, refreshToken, profile, done) {
    console.log(profile)
    return done();
}));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get("/auth/twitch", passport.authenticate('twitch'));
app.get("/logged",
	passport.authenticate("twitch", {failureRedirect:"/"}),
	function(req, res) {
	    console.log(req.user);
	    res.redirect("/logged");
	});

app.listen(3000);
