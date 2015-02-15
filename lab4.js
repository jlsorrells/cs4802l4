
"use strict"

var depthColor = 2;
var slider;
var brush;

//Make an SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 800)
                                    .attr("height", 700);

var treemap = d3.layout.treemap().size([800, 600])
    .value(function (d) { return (d.name.match(/\n/g) || []).length + 1; });
    
var color = d3.scale.category20b();

//creates a slider using d3 brush
function createSlider() {
    var x = d3.scale.linear()
        .domain([0, 14])
        .range([0, 600])
        .clamp(true);
        
    brush = d3.svg.brush()
        .x(x)
        .extent([14, 14])
        .on("brush", brushed);
        
    svgContainer.append("g")
        .attr("webkit-user-select", "none")
        .attr("transform", "translate(100,50)")
        .call(d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(function(d) { return d; })
            .tickSize(0)
            .tickPadding(12))
      .select(".domain")
      .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
            .attr("stroke", "grey")
            .attr("stroke-width", 2);
            
    svgContainer.append("text").text("Depth of tree to group by")
        .attr("x", 100)
        .attr("y", 20)
        .attr("font-size", "20px");
        
    slider = svgContainer.append("g")
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
            // round to nearest integer
            value = Math.floor(value + 0.5);
            brush.extent([value, value]);
        }

        handle.attr("cx", x(value));
        depthColor = value;
        // update coloring of tree
        svgContainer.selectAll("rect").transition()
            .duration(1000)
            .attr("opacity", function (d) { return d.depth <= depthColor ? 1 : 0.05 });
    }
}

// load the treemap
d3.json("zoo.json", drawTree);

// create the depth slider
createSlider();

// draws the treemap
function drawTree(error, root) {
    var node = svgContainer.datum(root).selectAll(".node")
        .data(treemap.nodes)
        .enter().append("g").attr("transform", "translate(0,100)");
    // add rectangles
    node.append("rect")
        .attr("fill", function (d) { return color(d.name.split("\n")[0]); })
        .attr("opacity", 1)
        .attr("stroke-width", 2)
        .attr("stroke", "black")
        .call(position);
    // add text labels
    node.append("text").text(function(d) { return d.children ? null : d.name.replace(/\n/g,", "); })
        .attr("x", function(d) { return d.x + "px"; })
        .attr("y", function(d) { return d.y + 10 + "px"; })
        .attr("font-size", 10 + "px");
        
    // set the slider location now that this has loaded
    slider.call(brush.event)
        .transition().duration(1000)
        .call(brush.extent([2, 2]))
        .call(brush.event);
}

function position() {
  this.attr("x", function(d) { return d.x + "px"; })
      .attr("y", function(d) { return d.y + "px"; })
      .attr("width", function(d) { return Math.max(0, d.dx - 1) + "px"; })
      .attr("height", function(d) { return Math.max(0, d.dy - 1) + "px"; });
}
