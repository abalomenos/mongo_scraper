
$(document).ready(function() {

    // Variables
    var articleContainer = $(".article-container");

    // Event Listeners
    $(document).on("click", ".scrape-new", scrapeArticles);
    $(document).on("click", ".btn.notes", articleNote);
    $(document).on("click", ".btn.save", articleSave);
    $(document).on("click", ".btn.delete", articleUnSave);
    $(document).on("click", ".btn.saveNote", saveNote);
    $(document).on("click", ".btn.clearUnSaved", clearUnSavedArticles);
    $(document).on("click", ".btn.clearSaved", clearSavedArticles);
    

    // Event Handlers

    function initialize() {

        $.ajax({
            method: "GET",
            url: "/api/articles?saved=false"
        }).then(function(data) {
            articleContainer.empty();
            if (data && data.length) {
                renderNewArticles(data);
            } else {
                renderEmpty();
            }
        });
      }

    function scrapeArticles() {
        deleteNonSavedArticles();
        $.ajax({
            method: "GET",
            url: "/api/fetch"
        }).then(function() {
            initialize();
            // bootbox.alert($("<h3 class='text-center m-top-80'>").text(data.message));
        });
    }

    function renderNewArticles(articles) {
        var articleCards = [];
        for (var i = 0; i < articles.length; i++) {
            articleCards.push(newArticleCard(articles[i]));
        }
        articleContainer.append(articleCards);
    }

    function newArticleCard(article) {

        var card = $("<div class='card'>");
        card.attr("data-id", article._id);

        var cardHeader = $("<div class='card-header'>").append(
            $("<h3>").append(
                $("<a class='article-link' target='_blank' rel='noopener noreferrer'>")
                .attr("href", article.url)
                .text(article.headline),
                $("<a class='btn btn-success save'>Save Article</a>")
                .attr("data-id", article._id)
            )
        );
  
        var cardBody = $("<div class='card-body'>").append(
            $("<p>")
                .text(article.summary)
        );
  
        card.append(cardHeader, cardBody);
        return card;
    }
    
    // Delete All Non-Saved Articles
    function deleteNonSavedArticles() {
        $.ajax({
            method: "DELETE",
            url: "/api/articles-unsaved"
        });
    }

    // Delete All Saved Articles
    function deleteSavedArticles() {
        $.ajax({
            method: "DELETE",
            url: "/api/articles-saved"
        });
    }

    // Clear Un-Saved Articles
    function clearUnSavedArticles() {
        deleteNonSavedArticles();
        window.location.reload();
    }

    // Clear Saved Articles
    function clearSavedArticles() {
        deleteSavedArticles();
        window.location.reload();
    }
    

    // Get Note for current Saved Article
    function articleNote() {

        var currentArticle = $(this)
            .siblings(".article-link")
            .text()
            .trim();
        var currentArticleID = $(this).attr("data-id");
        
        // Get data from current Article
        $.ajax({
            method: "GET",
            url: "/api/article/" + currentArticleID
        }).then(function(data) {
            // Get NoteID for current Article
            noteID = data.note
            $.ajax({
                method: "GET",
                url: "/api/note/" + noteID
            }).then(function(data) {
                console.log("app notes " + data.body);
                var modalText = $("<div class='container-fluid text-center'>").append(
                    $("<h4>").text(currentArticle),
                    $("<hr>"),
                    $("<ul class='list-group note-container'>"),
                    $("<textarea placeholder='New Note' rows='4' cols='60'>")
                    .text(data.body),
                    $("<button class='btn btn-success saveNote'>Save Note</button>")
                    .attr("data-id", currentArticleID)
                );
        
                // Adding the formatted HTML to the note modal
                bootbox.dialog({
                    message: modalText,
                    closeButton: true
                });
                
            });
        });
    }

    // Update Note for Current Article
    function saveNote() {
        // Get data from current Article
        var currentArticleID = $(this).attr("data-id");
        $.ajax({
            method: "GET",
            url: "/api/article/" + currentArticleID
        }).then(function(data) {
            // Get NoteID for current Article
            noteID = data.note
            var newNote = $(".bootbox-body textarea")
            .val()
            .trim();
            $.ajax({
                method: "POST",
                url: "/api/note/" + noteID,
                data: {
                    body: newNote
                }
            })    
        });
        bootbox.hideAll();  
      }


    // Un-Save Article
    function articleUnSave() {
        var currentArticleID = $(this).attr("data-id");
        console.log(currentArticleID);
        // Run a POST request to Un-Save the Article
        $.ajax({
            method: "POST",
            url: "/api/article-unsave/" + currentArticleID
        });
        // Delete from the DOM
        $(this).parent().parent().parent().remove();
    }

    // Save Article
    function articleSave() {
        var currentArticleID = $(this).attr("data-id");

        // Run a POST request to Save the Article
        $.ajax({
            method: "POST",
            url: "/api/article-save/" + currentArticleID,
        })
            // Delete from the DOM
            $(this).parent().parent().parent().remove();
        };
      

});