socket.on("connect", function () {
    console.log("Connected!");
});

io.on("connection", function (socket) {
    var tweet = {user: "nodesource", text: "Hello, world!"};

    // to make things interesting, have it send every second
    var interval = setInterval(function () {
        socket.emit("tweet", tweet);
    }, 1000);

    socket.on("disconnect", function () {
        clearInterval(interval);
    });
});

//we can decide on actions and frequency of data transmission here
socket.on("tweet", function(tweet) {
    // todo: add the tweet as a DOM node
    console.log("tweet from", tweet.username);
    console.log("contents:", tweet.text);
});