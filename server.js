const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Include users.js file from the api directory (We will add this in the next step)
const authRoutes = require("./api/routes/auth");

// Configure body-parser settings
app.use(bodyParser.urlencoded({ extended: true }));

// Parse json with body-parser
app.use(bodyParser.json());

// Setup your api routes with express
app.use("/v1/auth", authRoutes);

// Listen on port 3000 if environment variable is not set
const port = process.env.PORT || 3000;

// express returns an HTTP server
app.listen(port, () => console.log("[Server] online " + new Date()));