
"use strict"

var largeRect = true;

//Make an SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 800)
                                    .attr("height", 600);

var treemap = d3.layout.treemap().size([800, 600])
    .value(function (d) { return d.size; });
    
var color = d3.scale.category20b();

d3.json("test.json", doStuff);

function doStuff(error, root) {
    var node = svgContainer.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("g");
    node.append("rect")
        .attr("fill", function (d) { return color(d.name); })
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .attr("opacity", function (d) { return Math.pow((1 - d.depth / 5), 2); })
        .call(position);
    node.append("text").text(function(d) { return d.children ? null : d.name; })
        .attr("x", function(d) { return d.x + "px"; })
        .attr("y", function(d) { return d.y + 10 + "px"; })
        .attr("font-size", 10 + "px");
}

function position() {
  this.attr("x", function(d) { return d.x + "px"; })
      .attr("y", function(d) { return d.y + "px"; })
      .attr("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .attr("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
