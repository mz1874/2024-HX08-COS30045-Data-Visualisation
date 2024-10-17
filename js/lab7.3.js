function init() {
    var dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    // Define the keys that need to be stacked
    var keys = ["apples", "oranges", "grapes"];

    // Use d3.stack() to stack the data
    const series = d3.stack()
        .order(d3.stackOrderDescending)  // Set the stacking order to descending
        .keys(keys)(dataset);

    const width = 300;
    const height = 300;

    // Define scales
    var xScale = d3.scaleBand()
        .domain(d3.range(dataset.length))  // Number of data points per group
        .range([0, width])
        .padding(0.1);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.apples + d.oranges + d.grapes)])  // Maximum sum of the stacks
        .range([height, 0]);

    // Define a color scale
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create SVG container
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Create groups and draw each stacked part
    var groups = svg.selectAll("g.layer")
        .data(series)
        .enter()
        .append("g")
        .attr("class", "layer")
        .style("fill", (d, i) => color(i));

    // Add rectangles to draw the bar chart
    groups.selectAll("rect")
        .data(d => d)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i))
        .attr("y", d => yScale(d[1]))  // Upper boundary of the stacked part
        .attr("height", d => yScale(d[0]) - yScale(d[1]))  // Height of the stacked part
        .attr("width", xScale.bandwidth());

    // Add the X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat((d, i) => i + 1));  // Custom labels for the axis

    // Add the Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale));
}

init();
