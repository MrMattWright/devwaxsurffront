var socket;
var tweets = [];
//socket = io.connect("http://devwax.herokuapp.com:80")
socket = io.connect("http://localhost:5000")

socket.on("connect", function () {
  console.log("connected", true);
})

// overwrite all tweets
socket.on("tweets", function(initialTweets){
  console.log("tweets", initialTweets);
  tweets = initialTweets;
  drawTweets();
});

// push a new tweet
socket.on("tweet", function (tweet) {
  console.log("tweet", tweet);
  tweets.push(tweet);
  drawTweets();
})

var width = window.innerWidth,
    height = window.innerHeight;
 
var projection = d3.geo.orthographic()
    .scale(270)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(.1);

var tweetScale = 0.015;
 
var zoom = d3.behavior.zoom()
        .scaleExtent([1,6])
        .on("zoom",zoomed);
 
var zoomEnhanced = d3.geo.zoom().projection(projection)
        .on("zoom",zoomedEnhanced);
 
var drag = d3.behavior.drag()
          .origin(function() { var r = projection.rotate(); return {x: r[0], y: -r[1]}; })
          .on("drag", dragged)
          .on("dragstart", dragstarted)
          .on("dragend", dragended);
 
var path = d3.geo.path()
    .projection(projection);
 
var graticule = d3.geo.graticule();
 
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
 
var pathG = svg.append("g");
 
svg.append("rect")
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .call(zoomEnhanced)
 
pathG.append("defs").append("path")
    .datum({type: "Sphere"})
    .attr("id", "sphere")
    .attr("d", path);
 
pathG.append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#sphere");
 
pathG.append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#sphere");
 
pathG.append("path")
    .datum(graticule)
    .attr("class", "graticule")
    .attr("d", path);
 
d3.json("/world-110m.json", function(error, world) {
  // to render meridians/graticules on top of lands, use insert which adds new path before graticule in the selection
  pathG.insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path)
 
  pathG.insert("path", ".graticule")
      .datum(topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; }))
      .attr("class", "boundary")
      .attr("d", path);

});

// apply transformations to map and all elements on it 
  function zoomed()
  {
    pathG.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    //grids.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
    //geofeatures.select("path.graticule").style("stroke-width", 0.5 / d3.event.scale);
    pathG.selectAll("path.boundary").style("stroke-width", 0.5 / d3.event.scale);
  }
 
  function zoomedEnhanced()
  {
    pathG.selectAll("path").attr("d",path);
    pathG.selectAll("circle", ".graticule")
      .attr('cx', function(d){return projection(d.coords)[0]})
      .attr('cy', function(d){return projection(d.coords)[1]})
      .attr('r', projection.scale() * tweetScale);
  }
 
  function dragstarted(d) 
  {
    //stopPropagation prevents dragging to "bubble up" which triggers same event for all elements below this object
    d3.event.sourceEvent.stopPropagation();
    d3.select(this).classed("dragging", true);
  }
 
  function dragged()
  {
    projection.rotate([d3.event.x, -d3.event.y]);
    pathG.selectAll("path").attr("d", path);
  }
 
  function dragended(d) 
  {
    d3.select(this).classed("dragging", false);
  }


var drawTweets = function(){
  
  pathG.selectAll('circle')
    .data(tweets)
    .enter().insert('circle')
      .attr('class', function(d){
        if (d.score == 0) {
          return 'tweet-average'
        };
        return d.score > 0 ? 'tweet-good' : 'tweet-bad'
      })
      .attr('cx', function(d){return projection(d.coords)[0]})
      .attr('cy', function(d){return projection(d.coords)[1]})
      .attr('r', function(d){return projection.scale() * (tweetScale + (Math.abs(d.score * 5) / 1000)) })
      .append('title', function(d){return d.text});      
}
 
d3.select(self.frameElement).style("height", height + "px");
