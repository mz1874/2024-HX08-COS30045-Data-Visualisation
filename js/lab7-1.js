let width = 600;
let height = 300;

function lineChart(dataset) {
    xScale = d3.scaleTime()
        .domain([
            d3.min(dataset,d=>d.date),
            d3.max(dataset,d=>d.date),
        ])
        .range([0,width]);

    yScale = d3.scaleLinear()
        .domain([0,d3.max(dataset),d=>d.number])
        .range([height,0])

    line = d3.line()
        .x(d=>xScale(d.date))
        .y(d=>yScale(d.number))

    var svg = d3.select("#chart")
        .append("svg")
        .attr('width', width)
        .attr("height", height);
    svg.append("path")
        .datum(dataset)
        .attr("class","line")
        .attr("d",line)
}

function init() {

    var dataset;

    // 加载 CSV 文件并调用绘图函数
    d3.csv("Unemployment_78-95.csv", function (d) {
        console.log(d)
        return {
            date: new Date(+d.year, +d.month - 1),
            number: +d.number
        };
    }).then(d=>{
        dataset = d;
        console.table(dataset,["date", "number"]);
        lineChart(dataset);
    })
}

init();
