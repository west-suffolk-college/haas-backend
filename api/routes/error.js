"use strict";
const express = require("express");
//const port = process.env.PORT || 3000;
const router = express.Router();

const errorRoutes = function (app) {
    router.get("/", (req, res) => {
        res.status(520);
        res.set("Connection", "close");
        res.json({error:true, error_message : "something went wrong"});
    });
    return router;
}

module.exports = { errorRoutes };