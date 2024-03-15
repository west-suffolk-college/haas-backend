"use strict";
const express = require("express");
//const port = process.env.PORT || 3000;
const router = express.Router();

const errorRoutes = function (app) {
    router.get("/", function (req, res) {
        res.send({ msg: "there has been an error" });//change to res.render with html
        console.log("hit the error page")
    });

    router.get("/success", function (req, res) {
        res.send({ msg: "the successful error page" });//change to res.render with html
    });
    return router;
}

module.exports = { errorRoutes };