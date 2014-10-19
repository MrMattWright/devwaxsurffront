var _ = require('underscore');
var twit = require('twit');
var sentiment = require('sentiment');
var express = require("express");

var sentiments = require('./sentiments.js');
var beaches = require('./beaches.js');
var config = require('./config')

var hashtags = ["#surf", "#surfing", "#surfreport", "#surfforecast" ,"#surfsup"];

var http = require('http');
//make sure you keep this order
var app = express();
app.use(express.static(__dirname + '/static'));
app.set('port', (process.env.PORT || 5000));
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var initialTweets = [
  {
    score: 1,
    coords: [-4, 51]
  },
  { 
    score: 2,
    coords: [1, 38]
  },
  { 
    score: -5,
    coords: [3, 57]
  },
  { 
    score: -2,
    coords: [8, 46]
  },
];

function findAny(str, items)
{
  for (var i in items)
  {
    if (str.indexOf(items[i]) > -1)
      return items[i];
  }
  return null;
}

function recognisePlace(status)
{
  if (status.coordinates)
    return status.coordinates.coordinates;
  var found = findAny(status.text.toLowerCase(), _.keys(beaches));
  if (found)
    return beaches[found];
  else
    return null;

}

console.log(config.twitterKeys);

var t = new twit(config.twitterKeys);
var filterHashtags = {q: hashtags.join(" OR "), lang : "en", result_type : "recent", count : 100};
var stream = t.stream("statuses/filter", {track : hashtags, language : "en"}); 

io.on('connection', function(socket){
  console.log("connected, initialTweets: ", initialTweets);
  socket.emit('tweets', initialTweets);
  console.log("Getting results");

  var results = [];
  t.get("search/tweets", filterHashtags, function(err, data, response){
    _.each(data.statuses, function(status){
      var latLong = recognisePlace(status);       
      if (latLong)
      {
        var score = sentiment(status.text, sentiments).score;
        var tweet = {"coords" : latLong, "created" : status.created_at, "text" : status.text, "score" : score};
        results.push(tweet);
        socket.emit("tweet", tweet);
      }
    });
    console.log(results);
    initialTweets = results;
  });

  stream.on("tweet", function(status){ 
    var latLong = recognisePlace(status); 
    if (latLong) { 
      var score = sentiment(status.text, sentiments).score; 
      var result = {"coords" : latLong, "created" : status.created_at, "text" : status.text, "score" : score}; 
      console.log(result);
      socket.emit("tweet", result);
    } 
  }); 

});

// Start the app
server.listen(app.get('port'), function() {
   console.log("Node app is running at localhost:" + app.get('port'))
});

app.get('/', function(req,res){
 res.sendfile(__dirname + '/static/index.html');
}); 

