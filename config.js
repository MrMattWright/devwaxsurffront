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