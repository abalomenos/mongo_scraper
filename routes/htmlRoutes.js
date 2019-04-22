var db = require("../models");

module.exports = function(app) {

    // Route for index.html - Get all Non-Saved Articles from the DB
    app.get("/", function(req, res) {
        db.Article.find({ saved: false})
        .then(function(dbArticle) {
            res.render("index", {
                articles: dbArticle
            });
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
    
    // Route for saved.html - Get all Saved Articles from the DB
    app.get("/saved", function(req, res) {
        db.Article.find({ saved: true})
        .then(function(dbArticle) {
            res.render("saved", {
                articles: dbArticle
            });
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });
  
};
