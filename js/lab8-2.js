function init() {
    var w = 500;
    var h = 300;

    // Set up map projection
    var projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w / 2, h / 2])
        .scale(2450);

    // Use the projection to generate a geographic path
    var path = d3.geoPath().projection(projection);

    // Create an SVG element
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // Define color scale
    var color = d3.scaleQuantile().range(['#efedf5', '#bcbddc','#756bb1']);

    // Load geographic data
    d3.json("./LGA_VIC.json").then((json) => {

        // Load unemployment data
        d3.csv('VIC_LGA_unemployment.csv').then((data) => {

            // Iterate through unemployment data and match LGA names in geographic data
            for (var i = 0; i < data.length; i++) {
                var dataLGA = data[i].LGA;  // Get LGA name from CSV
                var dataValue = parseFloat(data[i].unemployed);  // Get unemployment rate and convert to a number

                // Find matching LGA in geographic data
                for (var j = 0; j < json.features.length; j++) {
                    var jsonLGA = json.features[j].properties.LGA_name;  // Get LGA name from geographic data

                    if (dataLGA === jsonLGA) {
                        // Add unemployment rate to the geographic data
                        json.features[j].properties.value = dataValue;
                        break;  // Stop searching after finding a match
                    }
                }
            }

            // Set the input domain of the color scale (based on unemployment rate)
            color.domain(d3.extent(data, d => d.unemployed));

            // Draw the map using GeoJSON data and color based on unemployment rate
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
                // Mark city locations
                svg.selectAll("circle")
                    .data(cities)
                    .enter()
                    .append("circle")
                    .attr("cx", d => projection([d.lon, d.lat])[0])  // Use longitude for x-coordinate with projection
                    .attr("cy", d => projection([d.lon, d.lat])[1])  // Use latitude for y-coordinate with projection
                    .attr("r", 3)  // Set radius for city marker circle
                    .attr("fill", "red")  // Set color for city marker
                    .attr("stroke", "#000")  // Optional, set border color for marker
                    .attr("stroke-width", 0.5);  // Optional, set border width for marker
            });
        });
    });
}

init();
