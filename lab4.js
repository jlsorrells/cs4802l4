
"use strict"

var largeRect = true;

//Make an SVG Container
var svgContainer = d3.select("body").append("svg")
                                    .attr("width", 400)
                                    .attr("height", 300);

var rect = svgContainer.append("rect").attr("x", 100)
                                      .attr("y", 75)
                                      .attr("width", 200)
                                      .attr("height", 150)
                                      .attr("fill", "blue")
                                      .on("click", changeRect);
                           
var text = svgContainer.append("text").attr("x", 200)
                                      .attr("y", 150)
                                      .attr("font-size", 30)
                                      .attr("text-anchor", "middle")
                                      .attr("alignment-baseline", "central")
                                      .text("text 1");
function changeRect() {
    if (largeRect) {
        // make it small
        rect.transition().duration(500)
            .attr("width", 400 / 3)
            .attr("height", 100)
            .attr("x", 400 / 3)
            .attr("y", 100)
            .attr("fill", "green");
        
        text.text("text 2");
    } else {
        // make it large
        rect.transition().duration(500)
            .attr("width", 200)
            .attr("height", 150)
            .attr("x", 100)
            .attr("y", 75)
            .attr("fill", "blue");
        
        text.text("text 1");
    }
    largeRect = !largeRect;
}


