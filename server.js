
// ************** Imports ********************
var express = require("express");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");
// ************** Imports End ********************


// Server Port
var PORT = process.env.PORT || 3000;


// Initialize Express
var app = express();


// ************** Configure Middleware ********************

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Make public a static folder
app.use(express.static("public"));

// Handlebars
app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main",
        layoutsDir: __dirname + '/views/layouts/',
        partialsDir: __dirname + '/views/partials/'
    })
);
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/headlinesDB", { useNewUrlParser: true });

// ************** Configure Middleware End ********************


// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});


module.exports = app;