let color = true;

function draw() {
    // Create the bar chart
    svg.selectAll("rect")
        .data(dataSet)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);  // Use xScale to determine the horizontal position of each rectangle
        })
        .attr("y", function (d) {
            return yScale(d);  // The top position of the rectangle is determined by yScale
        })
        .attr("width", xScale.bandwidth()) // The width of the rectangle is determined by xScale's bandwidth
        .attr("height", function (d) {
            return height - yScale(d);  // The height of the rectangle is calculated using yScale
        })
        .attr("fill", "red")
        .on("mouseover", function (event,d ) {
            d3.select(this).attr("fill", "orange");
            var xPosition = parseFloat(d3.select(this).attr("x"))
            var yPosition = parseFloat(d3.select(this).attr("y"))
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition +10)
                .attr("y", yPosition + 20)
                .text(d)
        }).on("mouseout", function () {
        d3.select("#tooltip").remove();
        d3.select(this).attr("fill", "red");
    })

    // .append("title")  // Adding the tooltip
    // .text(function (d) {
    //     return d;
    // });
}

// Canvas width and height
let width = 500;
let height = 300;
var dataSet = [4, 90, 80, 10, 50, 80, 60, 4, 90, 80, 10, 50, 80, 60];

// Create X-axis scaleBand
var xScale = d3.scaleBand()
    .domain(d3.range(dataSet.length))
    .range([0, width])
    .padding(0.05);

// Create Y-axis scaleLinear
var yScale = d3.scaleLinear()
    .domain([0, (d3.max(dataSet) + 20)])  // +20 ensures all labels are visible above the bars
    .range([height, 0]);  // The range goes from the canvas height to 0 (Y-axis is reversed, so the bars start from the bottom)

var svg = d3.select("#test").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px green solid");

draw();

d3.select("#btn-add").on("click", () => {
    var newNumber = Math.floor(Math.random() * 25);
    dataSet.push(newNumber);

    // Update the domain of xScale and yScale
    xScale.domain(d3.range(dataSet.length));
    yScale.domain([0, d3.max(dataSet) + 20]);  // Adjust to fit new data

    var bars = svg.selectAll("rect").data(dataSet);

    // Create and merge new bars
    bars.enter()
        .append("rect")
        .on("mouseover", function (event,d ) {
            d3.select(this).attr("fill", "orange");
            var xPosition = parseFloat(d3.select(this).attr("x"))
            var yPosition = parseFloat(d3.select(this).attr("y"))
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition +10)
                .attr("y", yPosition + 20)
                .text(d)
        }).on("mouseout", function () {
        d3.select(this).attr("fill", "red");
        d3.select("#tooltip").remove();
    })
        .attr("x", width)  // New bars start from the right edge
        .attr("fill", "red")
        .attr("y", d => yScale(d))  // Correctly calculate the top position of the rectangle
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d))  // Calculate the correct height of the rectangle
        .merge(bars)
        .transition()
        .duration(500)
        .attr("x", (d, i) => xScale(i))  // Update the position of each bar
        .attr("y", d => yScale(d))  // Update the top position
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - yScale(d))  // Update the height
        .selectAll("rect");
});

d3.select("#btn-remove").on("click", () => {
    d3.select("#btn-remove").on("click", () => {
        dataSet.shift();  // Remove the first data point
        xScale.domain(d3.range(dataSet.length));
        var bars = svg.selectAll("rect").data(dataSet);
        // Remove the exiting bars with transition
        bars.exit()
            .transition()
            .duration(500)
            .attr("x", width)  // Move removed bars to the right before disappearing
            .remove();

        bars.transition()
            .duration(500)
            .attr("x", (d, i) => xScale(i))  // Adjust the x position of remaining bars
            .attr("y", d => yScale(d))       // Adjust the y position
            .attr("width", xScale.bandwidth())  // Adjust the width
            .attr("height", d => height - yScale(d));  // Adjust the height
    });
});

d3.select("#btn").on("click", () => {
    dataSet = dataSet.map(() => Math.floor(Math.random() * 25));
    svg.selectAll("rect")
        .data(dataSet)
        .transition()
        .duration(1000)
        .delay((d, i) => {
            return i / dataSet.length * 100;
        })
        .ease(d3.easeCircleOut)
        .attr("y", function (d) {
            return yScale(d);
        })
        .attr("height", function (d) {
            return height - yScale(d);
        })
        .attr("fill", color === true ? "red" : "blue");

    svg.selectAll("rect title")  // Update the tooltips on bars
        .text(function (d) {
            return d;
        });

    color = !color;
});