"use strict";
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require('express-session');


//configure session
app.use(session({
    secret: process.env.CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false}
}));
// Configure body-parser settings
app.use(bodyParser.urlencoded({ extended: true }));

// Parse json with body-parser
app.use(bodyParser.json());

// Include auth.js file from the api directory
const { authRoutes } = require("./api/routes/auth");
const { errorRoutes } = require("./api/routes/error");


// Set up your api routes with express
//app.use("/v1/auth", authRoutes);
app.use("/v1/auth", authRoutes(app));
app.use("/error", errorRoutes(app));

// Listen on port 3000 if environment variable is not set
const port = process.env.PORT || 3000;

// express returns an HTTP server
app.listen(port, () => console.log("[Server] online " + new Date()));