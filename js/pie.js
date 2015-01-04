/**
 * Experiement with a configurable/contained pie element.
 *
 */

var w = 300,
  h = 300,
  r = 70;

var vis = d3.select("body")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
  .append("svg:g")
    //.attr("class", "pie")
    .attr("transform", "translate(" + w/2 + "," + h/2 + ")")


function pieChart(userData) {
  var data = userData;
  var appendTo;

  var r = 70,
    outerBorder = 8,
    innerBorder = 3;

  function chart() {
    if (appendTo === null) {
      // throw error
    }

    var arc = d3.svg.arc()
      .outerRadius(r - outerBorder - innerBorder);

    var pie = d3.layout.pie()
      .value(function(d) { return d.value; });

    var container = appendTo.selectAll("g.pie")
      .data([data])
      .enter()
        .append("svg:g")
          .attr("class", "pie")

    // build border using person's predominant color
    container
      .append("svg:circle")
        .attr("r", r)
        .attr("fill", function(d, i) { console.log(d); return d.color;})
    // separate border from interior colors
    container
      .append("svg:circle")
        .attr("r", r - outerBorder)
        .attr("fill", "white");


    var arcs = container.selectAll("g.slice")
      .data(function(d, i) { console.log(d.colors); return pie(d.colors)})
      .enter()
        .append("svg:g")
          .attr("class", "slice");

    arcs.append("svg:path")
      .attr("fill", function(d, i) { return d.data.color; } )
      .attr("d", arc);


    container.append("svg:text")
      .attr("text-anchor", "middle")
      .text(function(d, i) { return d.name});
  }

  chart.appendTo = function(value) {
    appendTo = value;
    chart();
  };

  chart.r = function(value) {
    if (!arguments.length) return r;
    r = value;
    return chart;
  };

  chart.outerBorder = function(value) {
    if (!arguments.length) return outerBorder;
    outerBorder = value;
    return chart;
  };

  chart.innerBorder = function(value) {
    if (!arguments.length) return innerBorder;
    innerBorder = value;
    return chart;
  };

  return chart;
}


d3.json('data/pie.json', function(error, people) {

  pieChart(people[0])
    .r(70)
    .outerBorder(10)
    .innerBorder(3)
    .appendTo(vis);

})



