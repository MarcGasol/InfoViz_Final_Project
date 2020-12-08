const svg = d3.selectAll('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');


d3.json('counties-albers-10m.json').then((data)=>{
    //console.log(data.objects);
    const counties = topojson.feature(data, data.objects.counties);
    const states = topojson.feature(data, data.objects.states);
    console.log(counties);
    console.log(states);
    console.log(data.objects.counties.geometries.filter(d => d.id === "22105"));
    /*const projection = d3.geoNaturalEarth2()
    .scale(130)
    .center([0, 0])
    .rotate([0, 0])
    .translate([width/2, height/2]);*/
    //projection = d3.geoAlbersUsa().scale(120).translate([200, 130])

    const pathGenerator = d3.geoPath()//.projection(projection);
    svg.append('path');
    //svg.append('path2');
      //.attr("class", "sphere")
      //.attr('d', pathGenerator());
   
    
    console.log(pathGenerator.bounds(counties));

    //console.log(pathGenerator({type:'Sphere'}));
    //const paths1 = svg.selectAll('path')
    //  .data(counties.features);

    
    svg.selectAll('path').data(counties.features).enter().append('path')
      .attr('d', d => pathGenerator(d))
      .attr('id', d => d.id)
      .style("fill", d=>{
        let b = d.id/100000*255;
        t = "rgba(0,0,"+b+",255)";
        return t;
      })
      .on("mouseover", function(){
        d3.select(this).style("fill","purple").style('r','3');
      })
      .on("mouseout", function(){
        console.log(this.id);
        let b = this.id/100000*255;
        t = "rgba(0,0,"+b+",255)";
        d3.select(this).style("fill", t).style("r", "3");
      });
    
    
});
