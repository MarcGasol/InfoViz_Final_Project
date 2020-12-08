function binning(arr, interval, numOfBins){
    let bins = [];
    let binCount = 0;
    for (let i = 0; i < numOfBins; i += 1){
        bins.push({
            binNum: binCount,
            minNum: i*interval,
            maxNum: (i+1)*interval,
            count: 0
        })
        binCount++;
    }
    console.log(bins);

    for (let i = 0; i < arr.length; i++){
        let item = arr[i];
        for(let j = 0; j < bins.length; j++){
            let bin = bins[j];
            if(item > bin.minNum && item <= bin.maxNum){
                bin.count++;
            };
        };
    };
    return bins;
}


d3.csv("us_states_covid19_daily_modified.csv").then(function(data){
    //console.log(data);
    data.forEach(d => {
        d.state = d.State;
        d.month = d.Month;
        d.positive = +d.Positive;
        d.negative = +d.Negative;
    });
    let selection = d3.select("#list");
    selection.on("change", changeChart);

    function changeChart(){
        console.log(this.value);
        d3.select('g').remove();
        //draw_bar(this.value);
    }

    
    let svg2 = d3.select('#svg2')

    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    let slider = d3.select('#slider');
    let slidertext = d3.select('#slidertext');

    slider.on("input", function(){
        //console.log(this.value);
        slidertext.attr('value', month[this.value-1]);
        d3.selectAll('.point').remove();
        d3.selectAll('.bar').remove();
        //draw(month[this.value-1]);
      });
      
      
    function draw_bar(state){
        let temp = data.filter(d => (d.state === state));
        let temp2 = temp.map(d => d.positive);
        let temp3 = temp.map(d => d.negative);

        /*let months = 9;
        let numOfBins = 9;
        let interval = 1;
        let bins = binning(eruptions, interval, numOfBins);*/

        let xScale = d3.scaleBand()
            .range([0, width])
            .padding(0.4)
            .domain([0,9]);

        let yScale = d3.scaleLinear()
                .range([height, 0])
                .domain([0, d3.max(data, d=>d.positive)]);

        let g = svg.append("g")
                .attr("transform", "translate(" + 100 + "," + 100 + ")");
        
        let xAxis = d3.axisBottom(xScale);
        let yAxis = d3.axisLeft(yScale)
                    .ticks(5);

        g.append('g')
        .attr("transform", "translate(0," + (height) + ")")
        .attr('class', 'x-axis')
        .call(xAxis);
        g.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);

        g.selectAll('.bar')
        .data(bins)
        .enter().append('rect')
        .attr('class', "bar")
        .attr("x", d=> xScale(`${d.maxNum} minutes`))
        .attr('y', d=>yScale(d.count))
        .attr('width', xScale.bandwidth())
        .attr('height', d => {return height - yScale(d.count)})
        .on("mouseover", function(d){
            d3.select(this).style("fill", "red");
        })
        .on("mouseout", function(d){
            d3.select(this).style("fill", "darkorange");
        });
    }
})