var express = require("express");
var router  = express.Router();
var passport = require("passport");
const User = require("../models/user");
const Transition = require("../models/transition");

var date = new Date();

router.get("/", function(req, res){
    Transition.count().then((count) => {
        global.numberOfTransitionValue = count +1;
    });
    User.count().then((count) => {
        global.numberOfUserValue = count +1;
    });

    dataEnableForView = {
        numberOfTransition: global.numberOfTransitionValue,
        numberOfUser: global.numberOfUserValue,
        page: 'homepage'
    }

    res.render("homepage" , dataEnableForView );
});

router.get("/register", function(req, res){
   res.render("register", {page: 'register'}); 
});

router.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register", {error: err.message});
        }
        passport.authenticate("local")(req, res, function(){
           req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
           res.redirect("/"); 
        });
    });
});

router.get("/login", function(req, res){
    console.log(date+" Login");
   res.render("login", {page: 'login'}); 
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: 'Welcome to bankData!'
    }), function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   req.flash("success", "See you later!");
   res.redirect("/");
});

module.exports = router;