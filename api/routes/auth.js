// simeplcode-api/api/routes/users.js
// Include express
const express = require("express");
const passport = require('passport');
const session = require('express-session');

const port = process.env.PORT || 3000;

var OpenIDConnectStrategy = require('passport-openidconnect');


passport.use(new OpenIDConnectStrategy({
            issuer: process.env.ODIC_SERVER,
            authorizationURL: process.env.ODIC_SERVER + "/protocol/openid-connect/auth",
            tokenURL: process.env.ODIC_SERVER + "/protocol/openid-connect/token",
            userInfoURL: process.env.ODIC_SERVER + "/protocol/openid-connect/userinfo",
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLEINT_SECRET,
            callbackURL: "http://127.0.0.1:" + port + "/v1/auth/callback"
        },
        function verify(issuer, profile, cb) {
            db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
                issuer,
                profile.id
            ], function(err, cred) {
                if (err) { return cb(err); }
                if (!cred) {
                    // The account at the OpenID Provider (OP) has not logged in to this app
                    // before.  Create a new user account and associate it with the account
                    // at the OP.
                    db.run('INSERT INTO users (name) VALUES (?)', [
                        profile.displayName
                    ], function(err) {
                        if (err) { return cb(err); }
                        var id = this.lastID;
                        db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
                            id,
                            issuer,
                            profile.id
                        ], function(err) {
                            if (err) { return cb(err); }
                            var user = {
                                id: id.toString(),
                                name: profile.displayName
                            };
                            return cb(null, user);
                        });
                    });
                } else {
                    // The account at the OpenID Provider has previously logged in to the
                    // app.  Get the user account associated with the account at the OP and
                    // log the user in.
                    db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, user) {
                        if (err) { return cb(err); }
                        if (!user) { return cb(null, false); }
                        return cb(null, user);
                    });
                }
            })
        })
);


// Include express router middleware
const router = express.Router();

// Add a 'get' method to express router for our test route
router.get("/", function (req, res) {
    res.send({ msg: "/auth/login and /callback" });
});

router.use(session({
    secret: process.env.CLEINT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: true }
}));

router.get('/login', passport.authenticate('openidconnect'));

router.get('/callback',
    passport.authenticate('openidconnect', { failureRedirect: '/v1/auth/', failureMessage: true }),
    function(req, res) {
        res.redirect('/v1/');
});



// Exports the router object
module.exports = router;