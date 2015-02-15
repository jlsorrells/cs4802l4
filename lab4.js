
"use strict"

var depthColor = 2;

//Make an SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 800)
                                    .attr("height", 700);

var treemap = d3.layout.treemap().size([800, 600])
    .value(function (d) { return (d.name.match(/\n/g) || []).length + 1; });
    
var color = d3.scale.category20b();

function createSlider() {
    var x = d3.scale.linear()
        .domain([0, 18])
        .range([0, 600])
        .clamp(true);
        
    var brush = d3.svg.brush()
        .x(x)
        .extent([0, 0])
        .on("brush", brushed);
        
    var slider = svgContainer.append("g")
        .attr("transform", "translate(100,50)")
        .call(brush);
        
    slider.selectAll(".extent,.resize")
        .remove();

    slider.select(".background")
        .attr("transform", "translate(0,-25)")
        .attr("height", 50);

    var handle = slider.append("circle")
        .attr("fill", "blue")
        .attr("r", 9);
        
    function brushed() {
        var value = brush.extent()[0];

        if (d3.event.sourceEvent) { // not a programmatic event
            value = x.invert(d3.mouse(this)[0]);
            value = Math.floor(value);
            brush.extent([value, value]);
        }

        handle.attr("cx", x(value));
        console.log(value);
    }
}

// load the treemap
d3.json("test.json", doStuff);
// create the depth slider
createSlider();

function doStuff(error, root) {
    var node = svgContainer.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("g").attr("transform", "translate(0,100)");
    node.append("rect")
        .attr("fill", function (d) { return color(d.name); })
        .attr("opacity", function (d) { return d.depth == depthColor ? 1 : .05 })
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .call(position)
        .on("click", function () {depthColor = d3.select(this).transition().duration(500).attr("fill", "blue");});
    node.append("text").text(function(d) { return d.children ? null : d.name.replace(/\n/g,", "); })
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
