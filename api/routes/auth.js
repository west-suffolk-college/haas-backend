 "use strict";
// Include express
const express = require("express");
const passport = require('passport');
const OpenIDConnectStrategy = require('passport-openidconnect');
// set port 3000 if environment variable is not set
const port = process.env.PORT || 3000;
 // Include express router middleware
 const router = express.Router();

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

    passport.use("oidc", new OpenIDConnectStrategy({
        issuer: process.env.ODIC_SERVER,
        authorizationURL: process.env.ODIC_SERVER + "/protocol/openid-connect/auth",
        tokenURL: process.env.ODIC_SERVER + "/protocol/openid-connect/token",
        userInfoURL: process.env.ODIC_SERVER + "/protocol/openid-connect/userinfo",
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:" + port + "/v1/auth/callback",
        response_types: ['code'],
        scope: 'openid profile'
    }, (issuer, profile, done) => {
        return done(null, profile);
    }));


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


    router.use("/login", passport.authenticate("oidc"));


    router.use("/callback",
        passport.authenticate("oidc",{
            failureRedirect: "/error",
            failWithError: true,
            successRedirect: "/error/success"
        }),
    );
    return router;
}


// Exports the router object
module.exports = { authRoutes };