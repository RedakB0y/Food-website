require('dotenv').config();
const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
const passport = require("passport");
const { user, comment } = require("./mongoDB");
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
let value = "Food Website";
let count = 0;


app.use(express.json())
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://food-website-redakboy.herokuapp.com"
},
    function (accessToken, refreshToken, profile, cb) {
        user.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

app.get('/', (req, res) => {
    if (count == 1) {
        value = "Invalid Password";
    }
    else if (count == 0) {
        value = "Food Website";
    }
    else if (count == 2) {
        value = "Invalid Username";
    }
    res.render("login.ejs", { title: value });

})

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }));

app.get('/auth/google/main',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Successful authentication, redirect home.
        res.redirect('/main');
    }
);


app.get("/main", (req, res) => {
    if (req.isAuthenticated()) {
        comment.find({}, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                res.render("main.ejs", { coment: data });
            }
        })
    } else {
        res.redirect("/");
    }
});
app.post("/main", (req, res) => {
    console.log(req.user);
    let comm = new comment({
        title: req.body.cm_name,
        commentcontent: req.body.cm_content,
    });
    comment.insertMany(comm, function (err) {
        if (!err) {
            comm.save();
        }
    });
    res.redirect("/main");
})

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
})
app.post("/signup", (req, res) => {
    user.register({ username: req.body.username, gmail: req.body.mail }, req.body.password, function (err, userdata) {
        if (err) {
            res.redirect("/");
        } else {
            passport.authenticate('local')(req, res, function () {
                res.redirect("/main");
            });
        }

    });
});
app.post("/login", (req, res) => {
    user.find({}, (err, userfound) => {
        for (let index = 0; index < userfound.length; index++) {
            const element = userfound[index];
            if (element.username == req.body.username) {
                count = 1;
                break;
            }
            else {
                count = 2;
            }
        }

    })
    passport.authenticate('local', { failureRedirect: '/' })(req, res, function () {
        res.redirect("/main");
    });

})
app.post("/logout", (req, res) => {
    count = 0;
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Running on LocalHost: ' + PORT);
})