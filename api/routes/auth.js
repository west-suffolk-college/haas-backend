// simeplcode-api/api/routes/users.js
// Include express
const express = require("express");
const { Issuer } from 'openid-client';


// Include express router middleware
const router = express.Router();

// Add a 'get' method to express router for our test route
router.get("/", function (req, res) {
    res.send({ msg: "Testing" });
});

router.get("/login", function (req, res) {
    res.send({ msg: "Login screen" });
});

// Exports the router object
module.exports = router;