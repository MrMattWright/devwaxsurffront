devwaxsurffront
===============

Node.js Sentiment Analsys of Twitter and Surfing produced by all the coders and surfers that attended the meetup:
http://www.meetup.com/DevWax/events/204108212/

Pictures of that meetup: 
https://www.flickr.com/photos/mrmattwright/sets/72157648440798509/

Up and running on heroku: http://devwax.herokuapp.com 

<h3>Outline</h3>
Essentially this works in 4 phases.

1) Get a stream of tweets by hashtags ()
```
var hashtags = ["#surf", "#surfing", "#surfreport", "#surfforecast" ,"#surfsup"];
```

2) Get the geolocations of those via twitter or guessing based on known surf destinations (although the beaches.js file is a big guess based on the google maps api and could be much improved)

3) Get the sentiment of the tweet based on a tweaked use of https://github.com/thisandagain/sentiment. See sentiments.js for tweaks.

4) Plot the points based on location on a 3D D3 (yes that's right). Red is bad sentiment, green is good and the inital size is the weight of the tweet. 

Improvements include:
- Tweets on the wrong side of the world appear to "float"
- Poor location guessing
- Weights of circles do not stick after load
- Twitter API needs revisting as we appear to be using a very limited dataset
- Could use MagicSeaweed api, although their mail around usage was not exactly that friendly I have to say. 
- Should show actual text of tweets. 

If you want to improve, then knock yourself with a PR! :)

<h3>Setup:</h3>

Once you have the app cloned, change the config.js file to reflect your own twitter settings:

```
var config = {}

config.twitterKeys = {};
config.web = {};

config.twitterKeys = {
  "consumer_key" : process.env.CONSUMER_KEY || "YOUR_TWITTER_KEY_HERE",
  "consumer_secret" : process.env.CONSUMER_SECRET || "YOUR_TWITTER_SECRET_HERE",
  "access_token" : process.env.ACCESS_TOKEN || "YOUR_ACCESSS_TOKEN_KEY_HERE",
  "access_token_secret" : process.env.TOKEN_SECRET || "YOUR_ACCESS_TOKEN_SECRET_KEY_HERE"
};

module.exports = config;
```

There is an important hard coded value in the client.js file in static too, which you need to change if you want to listen locally on a certain port, or push to heroku etc.

client.js
```
//socket = io.connect("http://devwax.herokuapp.com:80")
socket = io.connect("http://localhost:5000")
```

Change those around as needed. 





