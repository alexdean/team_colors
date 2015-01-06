var width = 1400,
  height = 1200;

// pie charts
var r = 20,
  outerBorder = 5,
  innerBorder = 1;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// extract into PieChart component
var arc = d3.svg.arc()
  .outerRadius(r - outerBorder - innerBorder);
var pie = d3.layout.pie()
  .value(function(d) { return d.value; });

d3.json("data/network.json", function(error, graph) {

  // short links are stronger than long ones
  // to keep 'who is close to who' more accurate
  var linkStrength = d3.scale.linear()
    .domain([graph.meta.min_dist, graph.meta.max_dist])
    .range([1, 0]);

  var force = d3.layout.force()
    .charge(-30)
    //.chargeDistance(500)
    .size([width, height])
    .linkStrength(function(link, idx) {
      return linkStrength(link.distance);
    })
    .linkDistance(function(link, idx) {
      return link.distance * 55;
    });


  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  // close links are darker than long ones, but not by much.
  // ordinal scale with a few pre-set css classes might be better.
  var strokeColor = d3.scale.pow()
    .domain([graph.meta.min_dist, graph.meta.max_dist])
    .range(['#999', '#eee'])

  var link = svg.selectAll(".link")
    .data(graph.links).enter()
      .append("line")
      .style("stroke-width", "1px")
      .style("stroke", function(d,i) { return strokeColor(d.distance); })

  var node = svg.selectAll(".node")
    .data(graph.nodes).enter()
      .append("g")
      .attr("class", "node")

  // *** extract into PieChart component
  var container = node //.selectAll("g.pie")
    // data(data).enter()
    .append("svg:g")
      .attr("class", "pie")
      .call(force.drag)

  container
    .append("svg:circle") // build border using person's predominant color
      .attr("r", r)
      .attr("fill", function(d, i) { return d.color;})
    .append("svg:circle") // separate border from interior colors
      .attr("r", r - outerBorder)
      .attr("fill", "white");

  var arcs = container.selectAll("g.slice") // build the pie sections
    .data(function(d, i) { return pie(d.colors)})
    .enter()
      .append("svg:g")
        .attr("class", "slice");

  arcs.append("svg:path")
    .attr("fill", function(d, i) { return d.data.color; } )
    .attr("d", arc);

  container.append("svg:text") // add names
    .attr("text-anchor", "middle")
    .attr("y", r+10)
    .text(function(d, i) { return d.name});
  // *** extract into PieChart component


  force.on("tick", function() {
    link
      .attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });

    // node.attr("cx", function(d) { return d.x; })
    //     .attr("cy", function(d) { return d.y; });
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });
});
