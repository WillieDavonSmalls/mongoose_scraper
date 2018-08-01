//  NPM Packages
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require("path");


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
var db = require("./models/article");


// Initialize Express
var app = express();
var PORT = process.env.PORT || 3001;

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));



// ********************** Scrape NY Times ********************** \\
app.get("/api/scrape", function(request, result) {
      // First, we grab the body of the html with request
  axios.get("https://www.nytimes.com/")
  .then(function(response){
  // Then, we load that into cheerio and save it to $ for a shorthand selector
  var scrapedResults = []
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
// ********************** End Scrape NY Times ********************** \\

// ********************** Get Articles Saved in DB********************** \\
app.get("/api/articles", function(req, res) {
  // Grab every document in the Articles collection
  db.article.find({})
    .then(function(dbArticle) {
      // If we were able to successfully find Articles, send them back to the client
      res.json(dbArticle);
    })
    .catch(function(error) {
      // If an error occurred, send it to the client
      res.json(error);
    });
});
// ********************** End Articles Saved in DB********************** \\


app.post("/api/save", function (request, result) {

  console.log('link');
  console.log(request.body.link);
  console.log('title');
  console.log(request.body.title);
  console.log('summary');
  console.log(request.body.summary);

  
  // db.article.create(request.body.inputArticle)
  // .then(function(dbArticle) {
  //   // If saved successfully, print the new Example document to the console
  //   console.log(dbArticle);
  // })
  // .catch(function(err) {
  //   // If an error occurs, log the error message
  //   console.log(err.message);
  // });

  result.send(request.body);

});

// app.get("/api/extractsaved", function(request, result) {
//   result.send('saved articles');
//   db.article.find({}, function (error, document) {
//     // docs.forEach
//     console.log(document);
//   });
// });




// ********************** Start the Server ********************** \\
app.listen(PORT, function(error) {
  if (error) {throw error}
  console.log("App running on port " + PORT + "!");
});
// ********************** End Start the Server ********************** \\

// ********************** test data  ********************** \\
// var test = {
//   'link': 'test',
//   'title': 'test',
//   'summary': 'test',
//   'note': ["hello", "hello2", "hello3"]
// }

//   db.article.create(test)
//   .then(function(dbArticle) {
//     // If saved successfully, print the new Example document to the console
//     console.log(dbArticle);
//   })
//   .catch(function(err) {
//     // If an error occurs, log the error message
//     console.log(err.message);
//   });
// ********************** End test data  ******************** \\
