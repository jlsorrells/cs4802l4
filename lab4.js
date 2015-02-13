
"use strict"

var largeRect = true;

//Make an SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 800)
                                    .attr("height", 500);

var treemap = d3.layout.treemap().size([800, 500])
    .value(function (d) { return d.size; });
    
var color = d3.scale.category20();

d3.json("test.json", doStuff);

function doStuff(error, root) {
    var node = svgContainer.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("rect")
            .attr("fill", function (d) { return color(d.name); })
            .attr("stroke-width", function (d) { return 10 - 2 * d.depth; })
            .attr("stroke", "black")
            .call(position);
}

function position() {
  this.attr("x", function(d) { return d.x + "px"; })
      .attr("y", function(d) { return d.y + "px"; })
      .attr("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .attr("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
