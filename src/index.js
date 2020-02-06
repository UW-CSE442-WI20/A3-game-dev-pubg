var dat;
d3.json("https://raw.githubusercontent.com/UW-CSE442-WI20/A3-game-dev-pubg/master/src/person_fixed.json").then( data => {
    console.log(data);
    dat = data;
});
console.log(dat);
// define the svg
const rect = {height: 20, marginV: 10, marginH: 10, marginT: 40};
const font = {height: 10, margin: 100};
const svg = d3.select("svg").append("g");

// load the initial data
let index = 0;
let dataEntry = dat[index];
// window.alert("hello");
let dataValue = dataEntry["entities"].sort((x, y) => y.total_global_sale - x.total_global_sale);
let maxSale = dataValue[0].total_global_sale;

const maxHeight = (rect.marginV + rect.height) * (dataValue.length-1) + rect.marginT;
let comment = svg.append("text").attr("x", 300).attr("y", maxHeight).attr("fill", "grey").text(dataEntry.year).style("font-size", "40");

// load data to svg
const groups = svg.selectAll("g").data(dataValue).enter().append("g").style("cursor", "pointer").on("click", () => update((++index) % dat.length));

// load labels and rects to svg
let labels = groups.append("text").text(d => d.publisher).attr("id", "label").attr("x", rect.marginH).style("font-size", `${font.height}px`);
let rects = groups.append("rect").attr("id", "rect").attr("x", rect.marginH + font.margin).attr("height", rect.height);

function updateElements(){

    // rerender the labels and rects
    let scale = d3.scaleLinear().domain([0, maxSale]).range([0,300]);
    labels.data(dataValue, d=>d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT + rect.height / 2);
    rects.data(dataValue, d=>d.publisher).transition().duration(600).attr("y", (_, i) => (rect.marginV + rect.height) * i + rect.marginT ).attr("width", d => scale(d.total_global_sale));

    // rerender the axis
    let xScale = d3.scaleLinear().domain([0, maxSale]).range([0,300]);
    let xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.format("d"));
    svg.append("g").attr("id", "axis").attr("transform","translate("+(rect.marginH + font.margin)+","+(maxHeight + rect.height + rect.marginV)+")").call(xAxis);
}

updateElements();

function update(i){

    // update the data and year
    dataEntry = dat[i];
    dataValue = dataEntry["entities"].sort((x, y) => y.total_global_sale - x.total_global_sale);
    maxSale = dataValue[0].total_global_sale;
    comment.text(dataEntry.year);

    // remove the old axis
    d3.select("#axis").remove();

    updateElements()
}

setInterval(()=> update((++index) % dat.length), 700);