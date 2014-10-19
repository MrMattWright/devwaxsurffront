var _ = require('underscore');
var twit = require('twit');
var sentiment = require('sentiment');
var sentiments = require('./sentiments.js');
var beaches = require('./beaches.js');

var twitterKeys = {
  "consumer_key" : "GMRFSZr56d7NBW6mSOCQ",
  "consumer_secret" : "3wkDIUr6gMFlTzgkPJz3TouOZjCG8ZPYMgm5gu83o0",
  "access_token" : "17296102-HXTSk30XLwijQVcgoVCwZCCQnaqMVq9riv1WUpr41",
  "access_token_secret" : "aRJaHSbqc7TmKWmn8DOfEw92IBuC9OUlFhbTeRjqmnQWa"
};

var hashtags = ["#surf", "#surfing", "#surfreport", "#surfforecast" ,"#surfsup"];

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

function pollTwitter()
{

  var t = new twit(twitterKeys);
  var filterHashtags = {q: hashtags.join(" OR "), lang : "en", result_type : "recent", count : 100};

  var results = [];
  t.get("search/tweets", filterHashtags, function(err, data, response){
    _.each(data.statuses, function(status){
      var latLong = recognisePlace(status);       
      if (latLong)
      {
        var score = sentiment(status.text, sentiments).score;
        results.push({"coords" : latLong, "created" : status.created_at, "text" : status.text, "score" : score})
      }
    });
    console.log(results);

  });
}

pollTwitter();

