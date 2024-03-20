"use strict";
const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("./auth")

const userRoutes = function (app) {
    router.get("/", isAuthenticated, (req, res) => {
        res.status(200);
        res.set("Connection", "close");
        res.json({error:false, error_message : ""});
    });
    router.get("/:user", isAuthenticated, (req, res) => {
        res.send({
            "name": req.user.name,
            "id": req.user.id
        })
    });
    return router;
}

module.exports = { userRoutes };

