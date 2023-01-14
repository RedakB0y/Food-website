const mongoose = require("mongoose");
const passport = require("passport");
const findOrCreate = require("mongoose-findorcreate");
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.connect("mongodb+srv://redak:<password>@cluster0.awcv0mb.mongodb.net/userDB");


const userschema = new mongoose.Schema({
    gmail: String,
    username: String,
    password: String,
    googleId: String,
});
userschema.plugin(passportLocalMongoose);
userschema.plugin(findOrCreate);
const user = new mongoose.model("user", userschema);
passport.use(user.createStrategy());
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

const commentschema=new mongoose.Schema({
    title:String,
    commentcontent:String,
})
const commentmodel = new mongoose.model("comments",commentschema);
module.exports = {
    user:user,
    comment:commentmodel
};
