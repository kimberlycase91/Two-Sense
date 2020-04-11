var express = require("express");
// var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Configure middleware

// // Use morgan logger for logging requests
// app.use(logger("dev"));

// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
// mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/twosense";

mongoose.connect(MONGODB_URI);


// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.wsj.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    // Now, we grab every h2 within an article tag, and do the following:
    $("article").each(function(i, element) {
      // Save an empty result object
      var result = [];

      // Add the text and href of every link, and save them as properties of the result object
      var title = $(this).find("h3").find("a").text();
      var link = $(this).find("h3").find("a").attr("href");
      var summary = $(this).find("p").text();


      result.push({
        title: title,
        link: link,
        summary: summary
      });

      console.log(result);
      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          // console.log(dbArticle);
          // console.log(result);
          console.log("articles added to database")
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });
    
    // Send a message to the client
    console.log("articles added to database")
  });
});

// Route for getting all Articles from the db
app.get("/", function(req, res) {

  db.Article.find({})
    .then(function(dbArticle) {
      var articleArray = [];
      for (var i=0; i <10; i++){
        articleArray.push({headline: dbArticle[i].title, link: dbArticle[i].link, summary: dbArticle[i].summary, id: dbArticle[i]._id});
    }
      res.render("index", {article: articleArray});
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {
  // route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
  db.Article.findById(req.params.id)
    // Specify that we want to populate the retrieved libraries with any associated books
    .populate("comment")
    .then(function(dbArticle) {
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
  db.Comment.create(req.body)
    .then(function(dbComment) {
      // If a Book was created successfully, find one library (there's only one) and push the new Book's _id to the Library's `books` array
      // { new: true } tells the query that we want it to return the updated Library -- it returns the original by default
      // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
      return db.Article.findOneAndUpdate({_id: req.params.id}, { $push: { comment: dbComment._id } }, { new: true });
    })
    .then(function(dbArticle) {
      // If the Library was updated successfully, send it back to the client
      res.json(dbArticle);
    })
    .catch(function(err) {
      // If an error occurs, send it back to the client
      res.json(err);
    });
});

app.get("/api/articles/:id", function(req, res){
  db.Article.findById(req.params.id)
  .populate("comment")
  .then(function(dbArticle) {
    console.log(dbArticle);
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurs, send it back to the client
    res.json(err);
  });
});

app.delete("/delete/:id", function(req, res){
  db.Comment.findByIdAndRemove(req.params.id, function(err){
    res.json(err);
  })
})

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
