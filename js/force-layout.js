var width = 1200,
  height = 1200;

// pie charts
var r = 20,
  outerBorder = 5,
  innerBorder = 1;

var strength = d3.scale.linear()
  .domain([0, 16])
  .range([0, 1]);

var force = d3.layout.force()
  .charge(-500)
  .chargeDistance(500)
  .size([width, height])
  .linkStrength(function(link, idx) {
    return strength(link.distance);
  })
  .linkDistance(function(link, idx) {
    return link.distance * 45;
  });

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

// extract into PieChart component
var arc = d3.svg.arc()
      .outerRadius(r - outerBorder - innerBorder);
var pie = d3.layout.pie()
  .value(function(d) { console.log('pie value', d); return d.value; });

d3.json("data/network.json", function(error, graph) {

  force
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  var link = svg.selectAll(".link")
    .data(graph.links).enter()
      .append("line")
      .attr("class", function(d,i) { return d.distance <= 5 ? 'link-close' : 'link'; } )
      //.style("stroke-width", "1px");

  var node = svg.selectAll(".node")
    .data(graph.nodes).enter()
      .append("g")
      .attr("class", "node")

  // node.append("circle")
  //   .attr("r", function(d) { return 20;})
  //   .style("fill", function(d) { return d.color; })
  //   .call(force.drag);

  // node.append("title")
  //   .text(function(d) { return d.name; });

  // node.append("text")
  //   .attr("dx", 12)
  //   .attr("dy", ".35em")
  //   .text(function(d) { return d.name });


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

  var arcs = container.selectAll("g.slice")
    .data(function(d, i) { return pie(d.colors)})
    .enter()
      .append("svg:g")
        .attr("class", "slice");

  arcs.append("svg:path")
    .attr("fill", function(d, i) { console.log('svg:path', d); return d.data.color; } )
    .attr("d", arc);


  container.append("svg:text")
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
