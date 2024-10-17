function init()
{
    var data = [30,50,88,33,15]
    const width = 300;
    const height = 300;

    var outerRadius = width /2;
    var innerRadius = 0 ;

    var arc = d3.arc()
        .outerRadius(outerRadius)
        .innerRadius(innerRadius);

    var pie = d3.pie();

    var svg = d3.select("#chart")
        .append("svg")
        .attr('width', width)
        .attr("height", height)
        .append("g")

    var arcs = svg.selectAll("g.arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    var color = d3.scaleOrdinal(d3.schemeCategory10)

    arcs.append("path")
        .attr("fill", function(d,i){
            return color(i);
        })
        .attr("d", function(d,i){
            return arc(d,i);
        })

    arcs.append("text")
        .text(function (d){
            return d.value;
        })
        .attr("transform", function (d){
            return "translate(" + arc.centroid(d) + 50 + ")";
        })
}

init();