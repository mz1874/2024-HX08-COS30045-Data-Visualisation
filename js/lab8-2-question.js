function init() {
    var w = 500;
    var h = 300;

    // Generate map
    var projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w / 2, h / 2])
        .scale(2450);

    // Generate path
    var path = d3.geoPath().projection(projection);

    // Create an SVG element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    var Tooltip = d3.select("#div_template")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute");

    var mouseover = function(event, d) {
        console.log(d);  // Debug
        Tooltip
            .style("opacity", 1)
            .html(d.place);  // Show CSV place data in the tooltip
        d3.select(this)
            .style("stroke", "black")
            .style("opacity", 1);
    };

    var mousemove = function(event, d) {
        console.log(d)
        Tooltip
            .style("left", (event.pageX + 10) + "px")  // X position of the mouse
            .style("top", (event.pageY + 10) + "px");  // Y position of the mouse
    };

    var mouseout = function(d) {
        Tooltip
            .style("opacity", 0);
        d3.select(this)
            .style("stroke", "#000")  // Restore original stroke
            .style("opacity", 1);
    };

    // Define color scale
    var color = d3.scaleQuantile().range(['#efedf5', '#bcbddc','#756bb1']);

    // Load LGA_VIC data
    d3.json("./LGA_VIC.json").then((json) => {

        // Load unemployment data
        d3.csv('VIC_LGA_unemployment.csv').then((data) => {

            // Match data
            for (var i = 0; i < data.length; i++) {
                var dataLGA = data[i].LGA;  // Get LGA name from CSV
                var dataValue = parseFloat(data[i].unemployed);  // Get unemployment rate and convert to number

                // Find matching LGA in geographic data
                for (var j = 0; j < json.features.length; j++) {
                    var jsonLGA = json.features[j].properties.LGA_name;  // Get LGA name from geographic data

                    if (dataLGA === jsonLGA) {
                        // Match found
                        json.features[j].properties.value = dataValue;
                        break;  // Stop searching after finding a match
                    }
                }
            }

            // Set the input domain of the color scale (based on unemployment rate)
            color.domain(d3.extent(data, d => d.unemployed));

            // Draw the map using GeoJSON data and set color based on unemployment rate
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", d => {
                    var unemploymentRate = d.properties.value;  // Get matched unemployment rate
                    return unemploymentRate ? color(unemploymentRate) : "#ccc";  // Fill with color based on unemployment, gray if unmatched
                })
                .attr("stroke", "#000")  // Optional, add borders to each region
                .attr("stroke-width", 0.5);  // Optional, adjust border width

            // Load city data
            d3.csv('VIC_city.csv').then((cities) => {
                // Mark the position of a city
                svg.selectAll("circle")
                    .data(cities)
                    .enter()
                    .append("circle")
                    .attr("cx", d => projection([d.lon, d.lat])[0])  // Use longitude to calculate x coordinate with projection
                    .attr("cy", d => projection([d.lon, d.lat])[1])  // Use latitude to calculate y coordinate with projection
                    .attr("r", 3)  // Set radius for city marker
                    .attr("fill", "red")  // Set color for city marker
                    .on("mouseover", mouseover)
                    .on("mousemove", mousemove)
                    .on("mouseout", mouseout);
            });
        });
    });
}

init();
