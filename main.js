const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');


d3.json('counties-albers-10m.json').then((data)=>{
    //console.log(data.objects);
    const counties = topojson.feature(data, data.objects.counties);
    const states = topojson.feature(data,data.objects.states);
    console.log(counties);
    console.log(states);
    /*const projection = d3.geoNaturalEarth2()
    .scale(130)
    .center([0, 0])
    .rotate([0, 0])
    .translate([width/2, height/2]);*/
    projection = d3.geoAlbersUsa().scale(120).translate([200, 130])

    const pathGenerator = d3.geoPath()//.projection(projection);
    svg.append('path');
      //.attr("class", "sphere")
      //.attr('d', pathGenerator());
   
    
    console.log(pathGenerator.bounds(counties));
    console.log(pathGenerator.bounds(states));
   

    //console.log(pathGenerator({type:'Sphere'}));
    /*const paths1 = svg.selectAll('path')
      .data(counties.features)
      
    paths1.enter().append('path')
      .attr("class", "counties")
      .attr('d', d => pathGenerator(d))*/
      /*.on("mouseover", function(){
        d3.select(this).style("fill", "red");
      })
      .on("mouseout", function(){
        d3.select(this).style("fill", "lightgreen").style("r", "3");
      })*/
      ;

    const paths2 = svg.selectAll('path')
      .data(states.features)

    paths2.enter().append('path')
      .attr("class", "states")
      .attr('d', d => pathGenerator(d))
      ;
      
    
});