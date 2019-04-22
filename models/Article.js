
// Imports
var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// Using the Schema constructor, create a new ArticleSchema object
var ArticleSchema = new Schema({
    headline: {
        type: String,
        required: true // to be able to ignore articles without a Headline
    },
    url: {
        type: String,
        required: false // to be able to get articles without URL
    },
    summary: {
        type: String,
        required: false // to be able to get articles without a Summary
    },
    saved: {
        type: Boolean,
        required: true,
        default: false
    },
    note: {
        type: Schema.Types.ObjectId,
        ref: "Note"
    }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
