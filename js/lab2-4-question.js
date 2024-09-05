// 定义绘制条形图的函数
function barChart(data) {
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            return i * (width / data.length);  // 设置 x 坐标
        })
        .attr("y", function (d) {
            return height - (d.wombats * 4);  // 设置 y 坐标（从底部开始）
        })
        .attr("width", width / data.length - 1)  // 设置每个矩形的宽度
        .attr("height", function (d) {
            return d.wombats * 4;  // 高度与数据值成比例
        })
        .attr("fill", function(d){
            if (d.wombats %2== 0)
            {
                return "skyblue";
            }else if(d.wombats %3== 0)
            {
                return "yellow";
            }else {
                return "green"
            }
        });

    // 在每个条形图上方添加文本，显示具体的数字
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", function (d, i) {
            return i * (width / data.length) + (width / data.length) / 2;  // 设置文本的 x 坐标，居中显示
        })
        .attr("y", function (d) {
            return height - (d.wombats * 4) + 11;  // 设置文本的 y 坐标，位于条形图上方
        })
        .attr("text-anchor", "middle")  // 文本居中对齐
        .attr("font-size", "14px")  // 设置字体大小
        .attr("fill", "black")  // 设置文本颜色
        .text(function (d) {
            return d.wombats;  // 显示具体的 wombats 数值
        });
}

let width = 1000;
let height = 500;

// 创建 SVG 元素
let svg = d3.select("#test")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("border", "1px green solid");

// 加载 CSV 文件并调用绘图函数
d3.csv("csv.csv").then(function (data) {
    // 确保 wombats 列为数字类型
    data.forEach(function (d) {
        d.wombats = +d.wombats;
    });

    // 调用绘制条形图的函数
    barChart(data);
});
