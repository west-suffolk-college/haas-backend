"use strict";
const express = require("express");
//const port = process.env.PORT || 3000;
const router = express.Router();

router.get("/", function (req, res) {
    res.send({ msg: "there has been an error" });//change to res.render with html
});

router.get("/success", function (req, res) {
    res.send({ msg: "the successful error page" });//change to res.render with html
});
module.exports = router;