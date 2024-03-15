 "use strict";
// Include express
const express = require("express");
const passport = require('passport');
const router = express.Router();
const LocalStrategy = require('passport-local');
 const {flatten} = require("express/lib/utils");



//setup passport
const authRoutes = function (app) {
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });



passport.use("local", new LocalStrategy({},
    async (username, password, done) => {
    if (username == "test" ) {
        console.log("user: " + username + "authenticated");
        return done(null, username, {message: "authenticated"});
    } else {
        console.log("somethings up");
        return done(null, false);
    }
    }))
    const isAuthenticated = function (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect("/v1/auth/login");
    }


// Add a 'get' method to express router for our test route
    router.get("/", isAuthenticated, (req, res) => {
        res.send({ msg: "/auth/login and /callback" });
    });


    router.use("/login", passport.authenticate("local"));

    app.delete("/logout", (req,res) => {
        req.logOut()
        res.redirect("/login")
        console.log(`-------> User Logged out`)
    })


    router.use("/callback",
        passport.authenticate("local",{
            failureRedirect: "/error",
            failWithError: true,
            successRedirect: "/error/success"
        }),
    );
    return router;
}


// Exports the router object
module.exports = { authRoutes };