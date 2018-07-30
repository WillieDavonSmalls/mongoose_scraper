var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

//mongoose connection
var connection = require("./config/connection.js")
mongoose.connect(connection.database)
.then( result => {
  console.log(`Connected to database '${result.connections[0].name}' on ${result.connections[0].host}:${result.connections[0].port}`);
})
.catch(err => console.log('There was an error with your connection:', err));;


// Require all models
var db = require("./models");

var PORT = process.env.PORT || 3001;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


// Routes
var scrapedResults = []

// Routes
// Scrape NYTimes
app.get("/api/scrape", function(request, result) {
      // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/")
  .then(function(response){
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);
    var html; 

    $("article.story").each(function(i, element) {
    
      var title = $(element).find("h2.story-heading").text().trim();
      var summary = $(element).find("p.summary").text().trim();
      var link = $(element).find("a").attr("href");
      // var img = $(element).find("a").find("img").attr("src"); //hold off on image
  

      if(title !== null && title !== '' && summary !== null && summary !== '' && link !== null && link !== ''){
          scrapedResults.push({'title':title, 'summary':summary, 'link':link});
      }

    });
  // If we were able to successfully scrape and save an Article, send a message to the client
  scrapedResults = scrapedResults.slice(0,20)
  result.send(scrapedResults);  
  })
  .catch(function (error) {
    console.log(error);
  });
});



// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

