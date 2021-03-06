var rangeSlider = document.getElementById("year_slider");
var rangeBullet = document.getElementById("rs-bullet");

rangeSlider.addEventListener("input", showSliderValue, false);

function showSliderValue() {
  rangeBullet.innerHTML = rangeSlider.value;
  var bulletPosition = ((rangeSlider.value - rangeSlider.min)/(rangeSlider.max - rangeSlider.min));
  rangeBullet.style.left = (bulletPosition * 578) + "px";
}

let index = 0;
d3.json("https://raw.githubusercontent.com/UW-CSE442-WI20/A3-game-dev-pubg/master/src/game_data.json").then( dat => {
    function draw() {
        // define the svg
        d3.selectAll("svg > *").remove();
        document.getElementById("controller").style.visibility = "visible";
        document.getElementById("option").style.visibility = "visible";
        d3.select("#play_pause_button").classed("paused", false);

        const rect = {height: 20, marginV: 10, marginH: 10, marginT: 40};
        let mar = (document.body.clientWidth - 750)/ 2;
        let svg = d3.select("svg").append("g");
        let stop = false;

        // load the initial data
        
        let dataEntry = dat[index % dat.length];

        let dataValue = dataEntry["entities"].sort((x, y) => y.total_global_sale - x.total_global_sale);
        let maxSale = dataValue[0].total_global_sale;
        if (d3.select("input[name='type']:checked").node().value === "average_global_sale") {
            dataValue = dataEntry["entities"].sort((x, y) => y.average_global_sale - x.average_global_sale);
            maxSale = dataValue[0].average_global_sale;
        } else if (d3.select("input[name='type']:checked").node().value === "average_user_score") {
            dataValue = dataEntry["entities"].sort((x, y) => y.average_user_score - x.average_user_score);
            maxSale = dataValue[0].average_user_score;
        } else if (d3.select("input[name='type']:checked").node().value === "average_critic_score") {
            dataValue = dataEntry["entities"].sort((x, y) => y.average_critic_score - x.average_critic_score);
            maxSale = dataValue[0].average_critic_score;
        }
        let maxlength = 0;
        for (let i = 0; i < dataValue.length; i++) {
            maxlength = Math.max(maxlength, dataValue[i].publisher.length);
        }
        let font = {height: 13, margin: 7.5 * maxlength};

        let maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;


        // load data to svg
        let groups = svg.selectAll("g").data(dataValue).enter().append("g")

        // load labels and rects to svg
        let labels = groups.append("text").text(d => d.publisher).attr("class", "label").attr("x", rect.marginH).style("cursor", "pointer").style("fill", 'rgb(33, 161, 280)').style("font-size", `${font.height}px`).on("click", function (d) {
            if (d["game"].length !== 0) {
                console.log(d);
                console.log(index);
                document.getElementById("controller").style.visibility = "hidden";
                document.getElementById("option").style.visibility = "hidden";
                stop = true;
                clearInterval(intervalId);
                d3.selectAll("svg > *").remove();
                svg = d3.select("svg").append("g");
                dataEntry = d;
                dataValue = dataEntry["game"].sort((x, y) => y.game_global_sale - x.game_global_sale);
                if (dataValue.length > 20) {
                    dataValue = dataValue.slice(0, 20)
                }
                maxSale = dataValue[0].game_global_sale;
                maxlength = 0;
                for (let i = 0; i < dataValue.length; i++) {
                    maxlength = Math.max(maxlength, dataValue[i].game_name.length);
                }
                font = {height: 12, margin: 6.8 * maxlength};
                maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;
                groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer").on("click", () => {
                    draw();
                });
                let gamelabels = groups.append("text").text(d => d.game_name).attr("x", rect.marginH).style("fill", 'rgb(33, 161, 280)').style("font-size", `${font.height}px`).on("mouseover", function(d) {
                    d3.select(this).style("fill", "rgb(213, 28, 0)")
                    d3.select(this).style("text-decoration", "underline")
                }).on("mouseout", function(d) {
                    d3.select(this).style("fill", "rgb(33, 161, 280)")
                    d3.select(this).style("text-decoration", "none")
                });
                let rects = groups.append("rect").attr("x", rect.marginH + font.margin).attr("height", rect.height).style("fill", "#f95e0a");
                let scale = d3.scaleLinear().domain([0, maxSale]).range([0, 400]);
                if (maxlength > 40) {
                    scale = d3.scaleLinear().domain([0, maxSale]).range([0, 300])
                }
                gamelabels.data(dataValue, d => d.game_name).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2);
                rects.data(dataValue, d => d.game_name).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.game_global_sale));
                for (let i = 0; i < dataValue.length; i++) {
                    svg.append("text")
                        .attr("x", scale(dataValue[i].game_global_sale) + rect.marginH + font.margin + 5).attr("y", (rect.marginV + rect.height) * i + rect.marginT + 12)
                        .attr("id", "num")
                        .transition()
                        .delay(300)
                        .duration(1)
                        .text(dataValue[i].game_global_sale.toFixed(2))
                        .style("font-size", "10");
                }
                let xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 400]);
                if (maxlength > 40) {
                    xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);
                }
                let xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format(".1f"));
                svg.append("g").attr("transform", "translate(" + (rect.marginH + font.margin) + "," + (maxHeight + rect.height + rect.marginV) + ")").call(xAxis);
                if (maxlength > 40) {
                    svg.append("text")
                        .attr("x", rect.marginH + font.margin + 315).attr("y", maxHeight + rect.height + rect.marginV + 5)
                        .attr("id", "legend")
                        .text("Million USD")
                        .style("font-size", "13");
                } else {
                    svg.append("text")
                        .attr("x", rect.marginH + font.margin + 415).attr("y", maxHeight + rect.height + rect.marginV + 5)
                        .attr("id", "legend")
                        .text("Million USD")
                        .style("font-size", "13");
                }
                svg.append("text")
                    .attr("x", rect.marginH).attr("y", rect.marginV + 5)
                    .text("Top 20 games published by " + d.publisher + " in " + (index % dat.length + 2003))
                    .style("font-size", "20");
            } else {
                window.alert(d["publisher"] + " published no games this year!");
            }
        }).on("mouseover", function(d) {
            d3.select(this).style("fill", "rgb(213, 28, 0)")
            d3.select(this).style("text-decoration", "underline")
        }).on("mouseout", function(d) {
            d3.select(this).style("fill", "rgb(33, 161, 280)")
            d3.select(this).style("text-decoration", "none")
        });
        let rects = groups.append("rect").attr("id", "rect").attr("x", rect.marginH + font.margin).attr("height", rect.height);

        // type means the which radio button is checked
        function updateElements(type) {

            let scale = d3.scaleLinear().domain([0, maxSale]).range([0, 500]);
            labels.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2);
            if (type === "total_global_sale") {
                d3.selectAll("#rect").style("fill", "#d51c00");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.total_global_sale));
                for (let i = 0; i < dataValue.length; i++) {
                    svg.append("text")
                        .attr("x", scale(dataValue[i].total_global_sale) + rect.marginH + font.margin + 5).attr("y", (rect.marginV + rect.height) * i + rect.marginT + 12)
                        .attr("id", "num")
                        .transition()
                        .delay(300)
                        .duration(1)
                        .text(dataValue[i].total_global_sale.toFixed(2))
                        .style("font-size", "10");
                }
            } else if (type === "average_global_sale") {
                d3.selectAll("#rect").style("fill", "#21a0b4");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_global_sale));
                for (let i = 0; i < dataValue.length; i++) {
                    svg.append("text")
                        .attr("x", scale(dataValue[i].average_global_sale) + rect.marginH + font.margin + 5).attr("y", (rect.marginV + rect.height) * i + rect.marginT + 12)
                        .attr("id", "num")
                        .transition()
                        .delay(300)
                        .duration(1)
                        .text(dataValue[i].average_global_sale.toFixed(2))
                        .style("font-size", "10");
                }
            } else if (type === "average_user_score") {
                d3.selectAll("#rect").style("fill", "#1f53a3");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_user_score));
                for (let i = 0; i < dataValue.length; i++) {
                    svg.append("text")
                        .attr("x", scale(dataValue[i].average_user_score) + rect.marginH + font.margin + 5).attr("y", (rect.marginV + rect.height) * i + rect.marginT + 12)
                        .attr("id", "num")
                        .transition()
                        .delay(300)
                        .duration(1)
                        .text(dataValue[i].average_user_score.toFixed(1))
                        .style("font-size", "10");
                }
            } else if (type === "average_critic_score") {
                d3.selectAll("#rect").style("fill", "#fab500");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_critic_score));
                for (let i = 0; i < dataValue.length; i++) {
                    svg.append("text")
                        .attr("x", scale(dataValue[i].average_critic_score) + rect.marginH + font.margin + 5).attr("y", (rect.marginV + rect.height) * i + rect.marginT + 12)
                        .attr("id", "num")
                        .transition()
                        .delay(300)
                        .duration(1)
                        .text(dataValue[i].average_critic_score.toFixed(1))
                        .style("font-size", "10");
                }
            }
            // rerender the axis
            let xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 500]);

            if (type === "average_user_score" || type === "average_critic_score") {
                xScale = d3.scaleLinear().domain([0, 100]).range([0, 500]);
            }

            let xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));

            if (type === "average_global_sale") {
                xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format(".1f"));
            }

            svg.append("g").attr("id", "axis").attr("transform", "translate(" + (rect.marginH + font.margin) + "," + (maxHeight + rect.height + rect.marginV) + ")").call(xAxis);
            if (type === "total_global_sale" || type === "average_global_sale") {
                svg.append("text")
                    .attr("x", rect.marginH + font.margin + 520).attr("y", maxHeight + rect.height + rect.marginV + 5)
                    .attr("id", "legend")
                    .text("Million USD")
                    .style("font-size", "13");
            }
        }

        if (!stop)
            updateElements(d3.select("input[name='type']:checked").node().value);

        function update(i, type) {
            rangeSlider.value = i % dat.length + 2003;
            rangeBullet.innerHTML = rangeSlider.value;
            var bulletPosition = ((rangeSlider.value - rangeSlider.min)/(rangeSlider.max - rangeSlider.min));
            rangeBullet.style.left = (bulletPosition * 578) + "px";
            if (!stop) {
                // update the data and year
                dataEntry = dat[i];
                if (type === "total_global_sale") {
                    dataValue = dataEntry["entities"].sort((x, y) => y.total_global_sale - x.total_global_sale);
                    maxSale = dataValue[0].total_global_sale;
                } else if (type === "average_global_sale") {
                    dataValue = dataEntry["entities"].sort((x, y) => y.average_global_sale - x.average_global_sale);
                    maxSale = dataValue[0].average_global_sale;
                } else if (type === "average_user_score") {
                    dataValue = dataEntry["entities"].sort((x, y) => y.average_user_score - x.average_user_score);
                    maxSale = dataValue[0].average_user_score;
                } else if (type === "average_critic_score") {
                    dataValue = dataEntry["entities"].sort((x, y) => y.average_critic_score - x.average_critic_score);
                    maxSale = dataValue[0].average_critic_score;
                }

                // remove the old axis
                d3.select("#axis").remove();
                d3.select("#legend").remove();
                d3.selectAll("#num").remove();

                updateElements(type)
            }
        }

        var intervalId;

        function updateGraphType(type) {
            update((index) % dat.length, type)
            clearInterval(intervalId);
            d3.select("#play_pause_button").classed("paused", true)
            // intervalId = setInterval(() => update((index++) % dat.length, type), 700);
        }

        // radio button are selected
        d3.selectAll("input[name='type']").on("change", function () {
            clearInterval(intervalId);
            d3.select("#play_pause_button").classed("paused", false)
            updateGraphType(this.value);
        });

        d3.select("#play_pause_button").on("click", function() {
            if (d3.select("#play_pause_button").classed("paused")) {
                d3.select("#play_pause_button").classed("paused", false)
            } else {
                d3.select("#play_pause_button").classed("paused", true)
            }
            if (d3.select("#play_pause_button").classed("paused")) {
                for (var i = 1; i <= intervalId; i++)
                    clearInterval(i);
            } else {
                intervalId = setInterval(() => update((++index) % dat.length,  d3.select("input[name='type']:checked").node().value), 1500);
            }
        });

        d3.select("#year_slider").on("input", function() {
            d3.select("#play_pause_button").classed("paused", true);
            clearInterval(intervalId);
            index = this.value - 2003;
            update(index % dat.length,  d3.select("input[name='type']:checked").node().value)
        });
        d3.select("#play_pause_button").classed("paused", true)
        // intervalId = setInterval(() => update((++index) % dat.length, d3.select("input[name='type']:checked").node().value), 700);
    }
    draw();
});
