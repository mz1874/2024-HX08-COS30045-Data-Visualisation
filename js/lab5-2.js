var ts = d3.easeCircleOut;

let color = true;
function draw() {
    // 创建柱状图
    svg.selectAll("rect")
        .data(dataSet)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return xScale(i);  // 使用xScale确定每个矩形的水平位置
        })
        .attr("y", function (d) {
            return yScale(d);  // 矩形的顶部位置由yScale决定
        })
        .attr("width", xScale.bandwidth()) // 矩形的宽度由xScale的bandwidth决定
        .attr("height", function (d) {
            return height - yScale(d);  // 矩形的高度根据yScale来计算
        })
        .attr("fill", "red");

    // 添加数值文本
    svg.selectAll("text")
        .data(dataSet)
        .enter()
        .append("text")
        .text(function (d) {
            return d;
        })
        .attr("x", function (d, i) {
            return xScale(i) + xScale.bandwidth() / 2;  // 确保文本在柱子中间
        })
        .attr("y", function (d) {
            return yScale(d) - 5;  // 确保文本在柱子上方
        })
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "green");
}

// 画布的宽度和高度
let width = 500;
let height = 300;
var dataSet = [4, 90, 80, 10, 50, 80, 60, 4, 90, 80, 10, 50, 80, 60];

// 创建X轴的scaleBand
var xScale = d3.scaleBand()
    .domain(d3.range(dataSet.length))
    .range([0, width])
    .padding(0.05);

// 创建Y轴的scaleLinear
var yScale = d3.scaleLinear()
    .domain([0, (d3.max(dataSet) +20)])  // + 20 is used for showing all tags above bar
    .range([height, 0]);  // 范围从画布的高度到0（注意Y轴是从上到下的，反转范围是为了让柱子从底部开始）

var svg = d3.select("#test").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px green solid");

console.log(dataSet);

draw();

d3.select("#btn-1").on("click", () => {
    ts = d3.easeBounceOut;
    // 更新数据
    dataSet = dataSet.map(() => Math.floor(Math.random() * 25));
    svg.selectAll("rect")
        .data(dataSet)
        .transition(ts)  // 添加过渡效果
        .duration(1000)  // 设置持续时间为1000ms（1秒）

        //setting each delay , for example , this first one is 100ms the second one is 200ms
        // .delay((d,i)=>{
        //     return i * 100;
        // })
        .delay((d,i)=>{
            return i / dataSet.length * 100;
        })
        .ease(ts)
        .attr("y", function (d) {
            return yScale(d);  // 确保矩形从新数据的顶部位置开始
        })
        .attr("height", function (d) {
            return height - yScale(d);  // 确保矩形高度更新
        })
        .attr("fill", color === true ? "red":"blue");  // 过渡时变更颜色为蓝色

    svg.selectAll("text")
        .data(dataSet)
        .transition(ts)
        // .delay((d,i)=>{
        //     return i * 100;
        // })

        .delay((d,i)=>{
            return i / dataSet.length * 100;
        })
        .duration(1000)
        .ease(ts)
        .text(function (d) {
            return d;
        })
        .attr("y", function (d) {
            return yScale(d) - 5;  // 确保文本在更新后的柱子上方
        });
    color =! color;
});

// Change transition easing function when button 2 is clicked
d3.select("#btn-2").on("click", () => {
    ts = d3.easeElasticOut;
    // 更新数据
    dataSet = dataSet.map(() => Math.floor(Math.random() * 25));
    svg.selectAll("rect")
        .data(dataSet)
        .transition(ts)  // 添加过渡效果
        .duration(1000)  // 设置持续时间为1000ms（1秒）

        //setting each delay , for example , this first one is 100ms the second one is 200ms
        // .delay((d,i)=>{
        //     return i * 100;
        // })
        .delay((d,i)=>{
            return i / dataSet.length * 100;
        })
        .ease(ts)
        .attr("y", function (d) {
            return yScale(d);  // 确保矩形从新数据的顶部位置开始
        })
        .attr("height", function (d) {
            return height - yScale(d);  // 确保矩形高度更新
        })
        .attr("fill", color === true ? "red":"blue");  // 过渡时变更颜色为蓝色

    svg.selectAll("text")
        .data(dataSet)
        .transition(ts)
        // .delay((d,i)=>{
        //     return i * 100;
        // })

        .delay((d,i)=>{
            return i / dataSet.length * 100;
        })
        .duration(1000)
        .ease(ts)
        .text(function (d) {
            return d;
        })
        .attr("y", function (d) {
            return yScale(d) - 5;  // 确保文本在更新后的柱子上方
        });
    color =! color;
});

d3.select("#btn").on("click", () => {
    // 更新数据
    dataSet = dataSet.map(() => Math.floor(Math.random() * 25));
    svg.selectAll("rect")
        .data(dataSet)
        .transition(ts)  // 添加过渡效果
        .duration(1000)  // 设置持续时间为1000ms（1秒）

        //setting each delay , for example , this first one is 100ms the second one is 200ms
        // .delay((d,i)=>{
        //     return i * 100;
        // })
        .delay((d,i)=>{
            return i / dataSet.length * 100;
        })
        .ease(d3.easeCircleOut)
        .attr("y", function (d) {
            return yScale(d);  // 确保矩形从新数据的顶部位置开始
        })
        .attr("height", function (d) {
            return height - yScale(d);  // 确保矩形高度更新
        })
        .attr("fill", color === true ? "red":"blue");  // 过渡时变更颜色为蓝色

    svg.selectAll("text")
        .data(dataSet)
        .transition(ts)
        // .delay((d,i)=>{
        //     return i * 100;
        // })

        .delay((d,i)=>{
            return i / dataSet.length * 100;
        })
        .duration(1000)
        .ease(d3.easeCircleOut)
        .text(function (d) {
            return d;
        })
        .attr("y", function (d) {
            return yScale(d) - 5;  // 确保文本在更新后的柱子上方
        });
    color =! color;
});