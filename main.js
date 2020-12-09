const svg = d3.selectAll('svg');
const width = +svg.attr('width');
const height = +svg.attr('height');

var data1;

const stateLabelValues = [
  { 'label':'Alabama', 'value': 'AL' },
  { 'label':'Alaska', 'value': 'AK'},
  { 'label':'American Samoa', 'value': 'AS'},
  { 'label':'Arizona', 'value': 'AZ'},
  { 'label':'Arkansas', 'value': 'AR'},
  { 'label':'California', 'value': 'CA'},
  { 'label':'Colorado', 'value': 'CO'},
  { 'label':'Connecticut', 'value': 'CT'},
  { 'label':'Delaware', 'value': 'DE'},
  { 'label':'District of Columbia', 'value': 'DC'},
  { 'label':'States of Micronesia', 'value': 'FM'},
  { 'label':'Florida', 'value': 'FL'},
  { 'label':'Georgia', 'value': 'GA'},
  { 'label':'Guam', 'value': 'GU'},
  { 'label':'Hawaii', 'value': 'HI'},
  { 'label':'Idaho', 'value': 'ID'},
  { 'label':'Illinois', 'value': 'IL'},
  { 'label':'Indiana', 'value': 'IN'},
  { 'label':'Iowa', 'value': 'IA'},
  { 'label':'Kansas', 'value': 'KS'},
  { 'label':'Kentucky', 'value': 'KY'},
  { 'label':'Louisiana', 'value': 'LA'},
  { 'label':'Maine', 'value': 'ME'},
  { 'label':'Marshall Islands', 'value': 'MH'},
  { 'label':'Maryland', 'value': 'MD'},
  { 'label':'Massachusetts', 'value': 'MA'},
  { 'label':'Michigan', 'value': 'MI'},
  { 'label':'Minnesota', 'value': 'MN'},
  { 'label':'Mississippi', 'value': 'MS'},
  { 'label':'Missouri', 'value': 'MO'},
  { 'label':'Montana', 'value': 'MT'},
  { 'label':'Nebraska', 'value': 'NE'},
  { 'label':'Nevada', 'value': 'NV'},
  { 'label':'New Hampshire', 'value': 'NH'},
  { 'label':'New Jersey', 'value': 'NJ'},
  { 'label':'New Mexico', 'value': 'NM'},
  { 'label':'New York', 'value': 'NY'},
  { 'label':'North Carolina', 'value': 'NC'},
  { 'label':'North Dakota', 'value': 'ND'},
  { 'label':'Northern Mariana Islands', 'value': 'MP'},
  { 'label':'Ohio', 'value': 'OH'},
  { 'label':'Oklahoma', 'value': 'OK'},
  { 'label':'Oregon', 'value': 'OR'},
  { 'label':'Palau', 'value': 'PW'},
  { 'label':'Pennsylvania', 'value': 'PA'},
  { 'label':'Puerto Rico', 'value': 'PR'},
  { 'label':'Rhode Island', 'value': 'RI'},
  { 'label':'South Carolina', 'value': 'SC'},
  { 'label':'South Dakota', 'value': 'SD'},
  { 'label':'Tennessee', 'value': 'TN'},
  { 'label':'Texas', 'value': 'TX'},
  { 'label':'Utah', 'value': 'UT'},
  { 'label':'Vermont', 'value': 'VT'},
  { 'label':'Virgin Islands', 'value': 'VI'},
  { 'label':'Virginia', 'value': 'VA'},
  { 'label':'Washington', 'value': 'WA'},
  { 'label':'West Virginia', 'value': 'WV'},
  { 'label':'Wisconsin', 'value': 'WI'},
  { 'label':'Wyoming', 'value': 'WY'}
  ];

d3.csv("us_states_covid19_daily_modified_copy.csv").then(function(data){
   data.forEach(element => {
    element.state = element.State;
    element.month = element.Month;
    element.positive = +element.Positive;
    element.negative = +element.Negative;
    element.id = +element.id;
    //element.deaths = +element.deaths;
   });

   data1 = data;

   d3.json('counties-albers-10m.json').then((data)=>{
    t = data1.filter(element => element.county=="Snohomish"
        &&element.month==1&&element.date==21);
    //console.log(t[0].cases);
    const counties = topojson.feature(data, data.objects.counties);
    const states = topojson.feature(data, data.objects.states);
    //console.log(counties);
    //console.log(states);
    //console.log(data.objects.counties.geometries.filter(d => d.id === "22105"));
    /*const projection = d3.geoNaturalEarth2()
    .scale(130)
    .center([0, 0])
    .rotate([0, 0])
    .translate([width/2, height/2]);*/
    //projection = d3.geoAlbersUsa().scale(120).translate([200, 130])

    // Option 1: give 2 color names
    var myColor = d3.scaleLinear().domain([0,100000])
    .range(["#00BFFF", "#F08080"]);
    //.range(["#F08080", "#00BFFF"]);

    draw_map("Jan", 1);
    //let prevm = "Jan", prevd = 1;
    let selection = d3.select("#listmonthdate");
    selection.on("change", changeChart);
    function changeChart(){
      d3.selectAll("path").remove();
      draw_map(this.value);
    }

    function draw_map(month){
      const pathGenerator = d3.geoPath()//.projection(projection);
      svg.append('path');
      //svg.append('path2');
        //.attr("class", "sphere")
        //.attr('d', pathGenerator());
      
      let div = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
      
      //console.log(pathGenerator.bounds(counties));

      //console.log(pathGenerator({type:'Sphere'}));
      //const paths1 = svg.selectAll('path')
      //  .data(counties.features);
      console.log(data1.filter(d=>d.state == "DC"));
      var stateLabel;
      svg.selectAll('path').data(states.features).enter().append('path')
        .attr('d', d => pathGenerator(d))
        .attr('id', d => d.id)
        .style("fill", d=>{
          let b = data1.filter(element => element.id == d.id&&element.month == month);
          return myColor(b[0].positive);
        })
        .on("mouseover", function(event, d){
          //d3.select(this).style("fill","purple").style('r','3');
          div.transition()
                  .duration(100)
                  .style("opacity", 0.9);
          let b = data1.filter(element => element.id == d.id&&element.month == month);
          //console.log(b);
          div.html(b[0].state+"\npositive:"+b[0].positive+"\nnegative:"+b[0].negative)
                  .style("left", (event.pageX+28) + "px")
                  .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function(){
          //t = "rgba(0,0,"+b+",255)";
          //d3.select(this).style("fill", myColor(this.id)).style("r", "3");
          //console.log(this.class);
          div.transition()
                .duration(100)
                .style("opacity", 0)
        });
      }
    
    })






})
  







//setTimeout(opetation,1000);