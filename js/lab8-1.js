function init()
{
    var w = 500;
    var h = 300;
    var projection  = d3.geoMercator()
    //change the mercator to specified part of the world
        .center([145,-36.5])
        .translate([w/2,h/2])
        .scale(2450)

    // build the path from projection
    var path = d3.geoPath().projection(projection);


    var svg = d3.select("#chart")
        .append("svg")
        .attr("width",w)
        .attr("height",h)
        .attr("fill", "grey")

    d3.json("./LGA_VIC.json").then((json)=>{
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
    })


}

init();