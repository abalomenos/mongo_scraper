
// ************** Imports ********************
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");
// ************** Imports End ********************

module.exports = function(app) {


    // A GET route for scraping the website
    app.get("/api/fetch", function(req, res) {
        // First, we grab the body of the html with axios
        axios.get("https://www.washingtonpost.com/").then(function(response) {
            // Then, we load that into cheerio and save it to $ for a shorthand selector
            var $ = cheerio.load(response.data);
            // Now, we grab every headline within an article tag, and do the following:
            $(".headline").each(function() {
                // Save an empty result object
                var result = {};
                // Add the text and href of every link, and save them as properties of the result object
                result.headline = $(this)
                    .children("a")
                    .text()
                    .trim();
                result.url = $(this)
                    .children("a")
                    .attr("href");
                result.summary = $(this)
                    .siblings(".blurb");
                    if (result.summary == "") {
                        result.summary = "No summary";
                    } else {
                        result.summary = $(this)
                        .text()
                        .trim();
                    }
                // Create a new Article using the `result` object built from scraping
                db.Article.create(result)
                .catch(function(err) {
                    // If an error occurred, log it
                    console.log(err);
                });
            });
            res.send("Scrape Complete");
        });
    });


    // Get articles base on query
    app.get("/api/articles", function(req, res) {
        var articles = req.query;        
            db.Article.find(articles)
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });


    // Get Note base on ID
    app.get("/api/note/:id", function(req, res) {      
            db.Note.findOne({ _id: req.params.id })
            .then(function(dbNote) {
                res.json(dbNote);
            })
            .catch(function(err) {
                res.json(err);
            });
    });


    // Get Article base on ID
    app.get("/api/article/:id", function(req, res) {
            db.Article.findOne({ _id: req.params.id })
            .then(function(dbArticle) {
                res.json(dbArticle);
            })
            .catch(function(err) {
                res.json(err);
            });
    });


    // Delete all Non-Saved Articles from the DB
    app.delete("/api/articles-unsaved", function(req, res) {
        db.Article.deleteMany({
            saved: false
        })
        .catch(function(err) {
            res.json(err);
        });
    });


    // Delete all Saved Articles from the DB
    app.delete("/api/articles-saved", function(req, res) {
        db.Article.deleteMany({
            saved: true
        })
        .catch(function(err) {
            res.json(err);
        });
    });


    // Update Note
    app.post("/api/note/:id", function(req, res){
        db.Note.findOneAndUpdate({
            _id: req.params.id
        }, {
            body: req.body.body
        }).then(function(dbEmployee) {
            res.json(dbEmployee);
        });
    })


    // Save Article and Create New Note for Article
    app.post("/api/article-save/:id", function(req, res) {
        // Create a new Note
        db.Note.create(req.body)
        .then(function(dbNote) {
            // Save Article and associate Note ID to it
            return db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: true,
                note: dbNote._id
            },
            {
                new: true
            }
            );
        })
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });


    // Un-Save Article and Remove Associated Note
    app.post("/api/article-unsave/:id", function(req, res) {
        db.Article.findOneAndUpdate({
                _id: req.params.id
            }, {
                saved: false
            }
        )
        .catch(function(err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
    });

}