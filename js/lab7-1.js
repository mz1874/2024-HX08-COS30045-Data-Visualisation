let width = 600;
let height = 300;
let margin = { top: 20, right: 30, bottom: 50, left: 60 };

function lineChart(dataset) {
    // Set up scales
    var xScale = d3.scaleTime()
        .domain([
            d3.min(dataset, d => d.date),
            d3.max(dataset, d => d.date),
        ])
        .range([0, width - margin.left - margin.right]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(dataset, d => d.number)])
        .range([height - margin.top - margin.bottom, 0]);

    // Define the line
    // Define the area generator
    var area = d3.area()
        .x(d => xScale(d.date))  // x轴对应日期
        .y1(d => yScale(d.number))  // y1为顶部（类似折线）
        .y0(yScale(0));  // y0为底部，表示从x轴开始填充

    // Create the SVG container
    var svg = d3.select("#chart")
        .append("svg")
        .attr('width', width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Append the line path
    // Append the area path
    svg.append("path")
        .datum(dataset)
        .attr("class", "area")
        .attr("d", area)
        .style("fill", "steelblue");

    // Create x-axis
    var xAxis = d3.axisBottom(xScale)
        .ticks(5);

    // Append x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
        .call(xAxis);

    // Create y-axis
    var yAxis = d3.axisLeft(yScale)
        .ticks(5);

    // Append y-axis
    svg.append("g")
        .call(yAxis);

        svg.append("line")
        .attr("x1", 0)  // Start from the leftmost part of the chart
        .attr("y1", yScale(500000))  // y position for 500,000
        .attr("x2", width - margin.left - margin.right)  // End at the rightmost part of the chart
        .attr("y2", yScale(500000))  // y position stays the same
        .style("stroke", "red")  // Optional: set the color of the line
        .style("stroke-width", "2px")  // Optional: set the thickness of the line
        .style("stroke-dasharray", "5,5");  // Optional: make the line dashed

    svg.append("text")
        .attr("class", "HalfMilLable")
        .attr("x", margin.left -50)
        .attr("y", yScale(500000) - 7)
        .text("Half a million unemployed")
        .attr("stroke", "red")


}

function init() {
    var dataset;

    // Load CSV file and call the plotting function
    d3.csv("Unemployment_78-95.csv", function (d) {
        return {
            date: new Date(+d.year, +d.month - 1),
            number: +d.number
        };
    }).then(d => {
        dataset = d;
        console.table(dataset, ["date", "number"]);
        lineChart(dataset);
    });
}

init();
