
const svg = d3.select('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');


d3.json('counties-albers-10m.json').then((data)=>{
    console.log(data.objects);
    const counties = topojson.feature(data, data.objects.counties);
    console.log(counties);


    const projection = d3.geoAlbersUsa().scale(1300).translate([487.5, 305]);

    const pathGenerator = d3.geoPath().projection(projection);

    svg.append('path')
      .attr("class", "sphere")
      .attr('d', pathGenerator({type:'Sphere'}));


    console.log(pathGenerator);
    console.log(pathGenerator({type:'Sphere'}));
        
});









