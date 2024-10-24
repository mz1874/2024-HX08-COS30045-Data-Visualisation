function init() {
    var w = 500;
    var h = 300;

    // 设置地图投影
    var projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w / 2, h / 2])
        .scale(2450);

    // 使用投影生成地理路径
    var path = d3.geoPath().projection(projection);

    // 创建 SVG 元素
    var svg = d3.select("#chart")
        .append("svg")
        .attr("width", w)
        .attr("height", h);

    // 定义颜色比例尺
    var color = d3.scaleQuantile().range(['#efedf5', '#bcbddc','#756bb1']);

    // 加载地理数据
    d3.json("./LGA_VIC.json").then((json) => {

        // 加载失业数据
        d3.csv('VIC_LGA_unemployment.csv').then((data) => {

            // 遍历失业数据，匹配地理数据中的 LGA 名称
            for (var i = 0; i < data.length; i++) {
                var dataLGA = data[i].LGA;  // 获取 CSV 中的 LGA 名称
                var dataValue = parseFloat(data[i].unemployed);  // 获取失业率数据并转为数字

                // 在地理数据中寻找匹配的 LGA
                for (var j = 0; j < json.features.length; j++) {
                    var jsonLGA = json.features[j].properties.LGA_name;  // 获取地理数据中的 LGA 名称

                    if (dataLGA === jsonLGA) {
                        // 将失业率数据添加到地理数据中
                        json.features[j].properties.value = dataValue;
                        break;  // 找到匹配后停止搜索
                    }
                }
            }

            // 设置颜色比例尺的输入域（根据失业率）
            color.domain(d3.extent(data, d => d.unemployed));

            // 使用 GeoJSON 数据绘制地图，并根据失业率设置颜色
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr("fill", d => {
                    var unemploymentRate = d.properties.value;  // 获取已匹配的失业率
                    return unemploymentRate ? color(unemploymentRate) : "#ccc";  // 根据失业率填充颜色，未匹配的区域填充灰色
                })
                .attr("stroke", "#000")  // 可选，给每个区域加边框
                .attr("stroke-width", 0.5);  // 可选，调整边框宽度

            // 加载城镇数据
            d3.csv('VIC_city.csv').then((cities) => {
                // 标记城镇位置
                svg.selectAll("circle")
                    .data(cities)
                    .enter()
                    .append("circle")
                    .attr("cx", d => projection([d.lon, d.lat])[0])  // 使用经纬度数据投影计算 x 坐标
                    .attr("cy", d => projection([d.lon, d.lat])[1])  // 使用经纬度数据投影计算 y 坐标
                    .attr("r", 3)  // 城镇标记圆的半径
                    .attr("fill", "red")  // 城镇标记的颜色
                    .attr("stroke", "#000")  // 可选，标记圆的边框颜色
                    .attr("stroke-width", 0.5);  // 可选，标记圆的边框宽度
            });
        });
    });
}

init();
