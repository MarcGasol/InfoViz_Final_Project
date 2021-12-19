let svg = d3.select('svg');

let margin = 300;
let gap_between_views = 70;
let width = svg.attr("width") - margin;
let height = (svg.attr("height") - margin)/2;

d3.csv('citi_bike_2020.csv').then(function(data){
    data.forEach(d => {
        d.start_from = +d.start_from;
        d.end_in = +d.end_in;
        d.trip_duration_start_from = +d.trip_duration_start_from;
        d.trip_duration_end_in = +d.trip_duration_end_in;
        let string = d.station;
        let result = string.replace("&", '');
        d.id = result;
});

let monthSlider = d3.select('#slider');
monthSlider.on('input', function(){
    d3.selectAll('.bar').remove();
    d3.selectAll('text').remove();
    d3.selectAll('.point').remove();
    draw_scatter(data, month_abbr[this.value-1]);
    draw_bar(data, month_abbr[this.value-1]);
    d3.select('#slidertext')
        .attr('value', month_abbr[this.value-1]);
});

//get data of the slided month
function slideMonth(data, month){
    temp=[];
    for(let i=0; i<data.length; i++){
        if(data[i].month == month){
            temp.push(data[i]);
        }
    };
    return temp;
}

month_abbr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function show_chart(data, month){
    draw_scatter(data, month);
    draw_bar(data, month);
}

show_chart(data, 'May');

//ScatterPlot
function draw_scatter(data, month) {

        var unchangeddata = data;

        var data = slideMonth(data, month);

        let g = svg.append("g")
                .attr("transform", "translate(" + 60 + "," + 20 + ")");
        
        let xScale = d3.scaleLinear()
                .range([0, 460])
                .domain([0, 2600]);
        
        xScale.nice();

        let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(unchangeddata, (d)=> d.trip_duration_end_in)]);
        
        yScale.nice();

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale)
                    .ticks(5);         

        g.append('g')
            .attr("transform", "translate(0," + (height) + ")")
            .attr('class', 'x-axis')
            .call(xAxis);
        g.append("text")
            .attr("x", 295)
            .attr("y", 240)
            .style("font-size", 15)
            .text("Trip duration start from")   

        g.append('g')
            .attr('class', 'y-axis')
            .call(yAxis);
        g.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 23)
            .attr("x", -140)
            .style("font-size", 15)
            .text("Trip duration end in") 
        
        var div = d3.select("body").append("div")
            .attr("class","tooltip")
            .attr("opacity", 0)

        g.selectAll('.point')
            .data(data)
            .enter().append('circle')
            .attr('class', "point")
            .attr("cx", d => xScale(d.trip_duration_start_from))
            .attr('cy', d => yScale(d.trip_duration_end_in))
            .attr("r", 5)
            .style('fill', '#4682b4')
            .style('stroke', '#000000')
            .style('stroke-width', 2)
        
        .on("mouseover", function(event, d){
                div.transition()
                    .duration(200)
                    .style("opacity", .9);
                div.html(d.station)
                    .style("left", (event.pageX) + "px")
                    .style("top", (event.pageY - 28) + "px");
                d3.select(this).transition()
                    .style("fill", '#FF0000')
                    .style("r", '10');
                d3.select('.bar').transition()
                    .style("fill", '#FF0000');
                
        })

        .on("mouseout", function(d){
                div.transition()
                    .duration(500)
                    .style("opacity", 0);
                d3.select(this).transition()
                    .style("fill", '#4682b4')
                    .style("r", '5');
                d3.select('.bar').classed('d.id', true).transition()
                    .style("fill", '#4682b4');
        })      
};


//BarChart
function draw_bar(data, month) {

        var unchangeddata = data;

        var data = slideMonth(data, month);

        let xScale = d3.scaleBand()
            .range([0, 460])
            .domain(unchangeddata.map( d=>d.station ));

        let yScale = d3.scaleLinear()
            .range([height, 0])
            .domain([0, d3.max(data, d=>4000)]);
            
        let g = svg.append("g")
            .attr("transform","translate(" + 60 + "," + 345 + ")");

        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale)
                    .ticks(5);

        g.append('g')
        .attr("transform", "translate(0," + (height) + ")")
        .attr('class', 'x-axis')
        .call(xAxis)
        .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform","rotate(-80)");

        g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
        g.append("text")
        .attr("y", -10)
        .attr("x", -5)
        .style("font-size", 15)
        .text("Bikers start from") 

        g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr("x", d => xScale(d.station))
        .attr("y",  d => yScale(d.start_from))
        .attr('width', xScale.bandwidth())
        .attr('height',  d => {return height - yScale(d.start_from)})
        .style('stroke', '#000000')
        .style('stroke-width', 2)

        .on("mouseover", function(d){
            d3.select(this).transition()
                .style("fill", '#FF0000')
            d3.select('.point').transition()
                .style("fill", '#FF0000');
        })

        .on("mouseout", function(d){
            d3.select(this).transition()
                .style("fill", '#4682b4')
            d3.select('.point').transition()
                .style("fill", '#4682b4');
        })
    };

});