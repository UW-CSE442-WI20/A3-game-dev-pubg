d3.json("https://raw.githubusercontent.com/UW-CSE442-WI20/A3-game-dev-pubg/master/src/person_fixed_with_score.json").then( dat => {
    function draw() {
        // define the svg
        d3.selectAll("svg > *").remove();
        const rect = {height: 20, marginV: 10, marginH: 10, marginT: 40};
        const font = {height: 10, margin: 100};
        let svg = d3.select("svg").append("g");
        let stop = false;

        // load the initial data
        let index = 0;
        let dataEntry = dat[index];

        let dataValue = dataEntry["entities"].sort((x, y) => y.total_global_sale - x.total_global_sale);
        let maxSale = dataValue[0].total_global_sale;

        let maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;
        let comment = svg.append("text").attr("x", 300).attr("y", maxHeight).attr("fill", "grey").text(dataEntry.year).style("font-size", "40");

        // load data to svg
        let groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer");

        // load labels and rects to svg
        let labels = groups.append("text").text(d => d.publisher).attr("id", "label").attr("x", rect.marginH).style("font-size", `${font.height}px`).on("click", function (d) {
            stop = true;
            d3.selectAll("svg > *").remove();
            svg = d3.select("svg").append("g");
            dataEntry = d;
            dataValue = dataEntry["game"].sort((x, y) => y.user_score - x.user_score);
            maxSale = dataValue[0].user_score;
            maxHeight = (rect.marginV + rect.height) * (dataValue.length - 1) + rect.marginT;
            groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer");
            let gamelabels = groups.append("text").text(d => d.game_name).attr("x", rect.marginH).style("font-size", `${font.height}px`).on("click", () => draw());
            let rects = groups.append("rect").attr("x", rect.marginH + font.margin).attr("height", rect.height);
            let scale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);
            gamelabels.data(dataValue, d => d.game_name).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2);
            rects.data(dataValue, d => d.game_name).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.user_score));
            let xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);
            let xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));
            svg.append("g").attr("transform", "translate(" + (rect.marginH + font.margin) + "," + (maxHeight + rect.height + rect.marginV) + ")").call(xAxis);
        });

        let rects = groups.append("rect").attr("id", "rect").attr("x", rect.marginH + font.margin).attr("height", rect.height);

        // type means the which radio button is checked
        function updateElements(type) {

            let scale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);
            labels.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2);
            if (type === "total_global_sale") {
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.total_global_sale));
            } else if (type === "average_global_sale") {
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_global_sale));
            } else if (type === "average_user_score") {
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_user_score));
            } else if (type === "average_critic_score") {
                rects.data(dataValue, d => d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT).attr("width", d => scale(d.average_critic_score));
            }
            // rerender the axis
            let xScale = d3.scaleLinear().domain([0, maxSale]).range([0, 300]);

            if (type === "average_user_score" || type === "average_critic_score") {
                xScale = d3.scaleLinear().domain([0, 100]).range([0, 300]);
            }

            let xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));

            if (type === "average_global_sale") {
                xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format(".1f"));
            }

            svg.append("g").attr("id", "axis").attr("transform", "translate(" + (rect.marginH + font.margin) + "," + (maxHeight + rect.height + rect.marginV) + ")").call(xAxis);
        }

        if (!stop)
            updateElements("total_global_sale");

        function update(i, type) {
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
                comment.text(dataEntry.year);

                // remove the old axis
                d3.select("#axis").remove();

                updateElements(type)
            }
        }

        var intervalId;

        function updateGraphType(type) {
            let index = 0;
            intervalId = setInterval(() => update((index++) % dat.length, type), 1300);
        }

        // radio button are selected
        d3.selectAll("input[name='type']").on("change", function () {
            clearInterval(intervalId);
            updateGraphType(this.value);
        });

        intervalId = setInterval(() => update((++index) % dat.length, "total_global_sale"), 1300);
    }
    draw();
});
