var width = 1300, height = 1000;

svg = d3.select("svg")
  .attr("height",height)
  .attr("width",width);

d3.select('#flagsContainer')
  .style("height",height + "px")
  .style("width",width+ "px");

d3.select("#container")
  .style("width", width + "px");

d3.json("https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json",function(data){
      
  var nodedata = data.nodes;
  var linkdata = data.links; 

  var nodes =  d3.select("#flagsContainer")
    .selectAll('img')
    .data(nodedata)
    .enter() 
    .append("img")
    .attr("class",function(d){ return "flag flag-" + d.code})
    .on("mouseover",function(d){
      d3.select(".tooltip").classed("hide",false);
      d3.select(".tooltip")
        .text(d.country)
        .style("left", d.x + "px")
        .style("top", d.y + "px")
        highlightLinks(d.country); 
    })
    .on("mouseout",function(){
      d3.select(".tooltip").classed("hide",true);
      removeLinkHighlight();
    })
    .call(
      d3.drag() 
			  .on("start", dragStarted)
			  .on("drag", dragging)
			  .on("end", dragEnded)
    );
 
  var lines = d3.select("svg")
    .selectAll("line")
    .data(linkdata)
    .enter()
    .append("line")
    .attr("class","line");
   
  var simulation = d3.forceSimulation(nodedata)
   .force('charge', d3.forceManyBody().strength(-4))
   .force('center', d3.forceCenter(width/2, height / 2))
   .force('collision', d3.forceCollide().radius(25))
   .force('lines', d3.forceLink().links(linkdata))
   .on('tick', ticked); 

  //Highlight Links
  function highlightLinks(country){
    lines.each(function(d){
     if(d.source.country === country || d.target.country === country){
       d3.select(this).classed("highlight",true);
     }  
    });  
  } 
  
  //Remove Highlight
  function removeLinkHighlight(){
    d3.selectAll(".line.highlight").classed("highlight",false); 
  }
  
  //Define drag event functions
	function dragStarted(d) {
		if (!d3.event.active) 
			simulation.alphaTarget(0.8).restart();
		d.fx = d.x;
		d.fy = d.y;
	}

	function dragging(d) {
		d.fx = d3.event.x;
		d.fy = d3.event.y;
	}

	function dragEnded(d) {
		if (!d3.event.active) 
			simulation.alphaTarget(0);				
	 	d.fx = null;
		d.fy = null;
	}
 
  function ticked() {
   //Update the position of all nodes and links  
   nodes
    .style("left",function(d){ return d.x + "px"; })
    .style("top",function(d){ return d.y + "px";  });
  
   lines.attr("x1",function(d){ return d.source.x})
     .attr("y1",function(d){ return d.source.y})
     .attr("x2",function(d){ return d.target.x})
     .attr("y2",function(d){ return d.target.y});
  }
});