"use strict";
// Include express
const express = require("express");
const passport = require('passport');
const router = express.Router();
const LocalStrategy = require('passport-local');
const {request, response} = require("express");

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/v1/auth/login");
}

const authRoutes = function (app) {
    const authMethod = (username, password, done) => {
        if (username === "test") {
            console.log("user: " + username + "is authenticated");
            let auth_user = {
                "id": 1234,//use db to get any values needed
                "name": "test"
            }
            return done(null, auth_user)
        } else {
            return done(null, false)
        }
    }
    app.use(passport.initialize());
    app.use(passport.authenticate('session'));
    passport.use("local", new LocalStrategy(authMethod))

    passport.serializeUser(function(user, done) {
        done(null, user);
    });
    passport.deserializeUser(function(user, done) {
        done(null, user);
    });

// Add a 'get' method to express router for our test route
    router.get("/", isAuthenticated, (req, res) => {
        res.status(200);
        res.set("Connection", "close");
        res.json({error:false, error_message : ""});
    });


    router.use("/login", passport.authenticate("local", {
        successReturnToOrRedirect: "/v1/auth",
        failureRedirect: "/error"
    }));

    router.delete('/logout', function(req, res, next){
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect("/error")
        });
    });


    router.use("/callback",
        passport.authenticate("local",{
            failureRedirect: "/error"
        }),
    );
    return router;
}


// Exports the router object
module.exports = { authRoutes, isAuthenticated };