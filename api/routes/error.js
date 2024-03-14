const express = require("express");
const passport = require('passport');
const session = require('express-session');

const port = process.env.PORT || 3000;
const router = express.Router();

router.get("/", function (req, res) {
    res.send({ msg: "there has been an error" });//change to res.render with html
});

module.exports = router;