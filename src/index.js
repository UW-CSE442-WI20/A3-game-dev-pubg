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
        d3.select("#play_pause_button").classed("paused", false);

        const rect = {height: 20, marginV: 10, marginH: 10, marginT: 40};
        let mar = (document.body.clientWidth - 750)/ 2;
        let svg = d3.select("svg").append("g").attr("transform", "translate("+mar+", 0)");
        let stop = false;

        // load the initial data
        
        let dataEntry = dat[index % dat.length];

        let dataValue = dataEntry["entities"].sort((x, y) => y.total_global_sale - x.total_global_sale);
        let maxSale = dataValue[0].total_global_sale;
        let maxlength = 0;
        for (let i = 0; i < dataValue.length; i++) {
            maxlength = Math.max(maxlength, dataValue[i].publisher.length);
        }
        let font = {height: 14, margin: 7.3 * maxlength};

        let maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;

        // load data to svg
        let groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer");

        // load labels and rects to svg
        let labels = groups.append("text").text(d => d.publisher).attr("id", "label").attr("x", rect.marginH).style("font-size", `${font.height}px`).on("click", function (d) {
            document.getElementById("controller").style.visibility = "hidden";    
            stop = true;
            clearInterval(intervalId);
            d3.selectAll("svg > *").remove();
            svg = d3.select("svg").append("g").attr("transform", "translate("+mar+", 0)");
            dataEntry = d;
            dataValue = dataEntry["game"].sort((x, y) => y.game_global_sale - x.game_global_sale);
            maxSale = dataValue[0].game_global_sale;
            maxlength = 0;
            for (let i = 0; i < dataValue.length; i++) {
                maxlength = Math.max(maxlength, dataValue[i].game_name.length);
            }
            font = {height: 14, margin: 7.5 * maxlength};
            maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;
            groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer").on("click", () => {
                draw();
                index--;
            });
            let gamelabels = groups.append("text").text(d => d.game_name).attr("x", rect.marginH).style("font-size", `${font.height}px`);
            let rects = groups.append("rect").attr("x", rect.marginH + font.margin).attr("height", rect.height).style("fill", "#69b3a2");
            let scale = d3.scaleLinear().domain([0, maxSale]).range([0, 500]);
            gamelabels.data(dataValue, d => d.game_name).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2);
            rects.data(dataValue, d => d.game_name).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.game_global_sale));
            let xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 500]);
            let xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format(".1f"));
            svg.append("g").attr("transform", "translate(" + (rect.marginH + font.margin) + "," + (maxHeight + rect.height + rect.marginV) + ")").call(xAxis);
            svg.append("text")
                .attr("x", rect.marginH + font.margin).attr("y", maxHeight + rect.height + rect.marginV).attr("fill", "grey")
                .style("text-anchor", "middle")
                .text("Date");
        });

        let rects = groups.append("rect").attr("id", "rect").attr("x", rect.marginH + font.margin).attr("height", rect.height);

        // type means the which radio button is checked
        function updateElements(type) {

            let scale = d3.scaleLinear().domain([0, maxSale]).range([0, 500]);
            labels.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2);
            if (type === "total_global_sale") {
                d3.selectAll("#rect").style("fill", "#dc143c");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.total_global_sale));
            } else if (type === "average_global_sale") {
                d3.selectAll("#rect").style("fill", "#00bfff");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_global_sale));
            } else if (type === "average_user_score") {
                d3.selectAll("#rect").style("fill", "#69b3a2");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_user_score));
            } else if (type === "average_critic_score") {
                d3.selectAll("#rect").style("fill", "#8a2be2");
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_critic_score));
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
            svg.append("text")
                .attr("x", rect.marginH + font.margin + 250).attr("y", maxHeight + rect.height + rect.marginV + 30)
                .attr("id", "legend")
                .text("Date");
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
                intervalId = setInterval(() => update((++index) % dat.length,  d3.select("input[name='type']:checked").node().value), 700);
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

