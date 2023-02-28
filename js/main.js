// Constants for the frame dimensions
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500; 
const MARGINS = {left: 50, right: 50, top: 50, bottom: 50};
const VIS_HEIGHT = FRAME_HEIGHT - MARGINS.top - MARGINS.bottom;
const VIS_WIDTH = FRAME_WIDTH - MARGINS.left - MARGINS.right; 

//This creates an svg for the 1st visual
const FRAME1 = d3.select("#vis-1") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 

const FRAME2 = d3.select("#vis-2") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


const FRAME3 = d3.select("#vis-3") 
                  .append("svg") 
                    .attr("height", FRAME_HEIGHT)   
                    .attr("width", FRAME_WIDTH)
                    .attr("class", "frame"); 


// This function creates the graph with the various points on the graph through the
// imported csv
function build_scatter_plot() {
  d3.csv("data/iris.csv").then((data) => {
    
    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE = d3.scaleLinear() 
                      .domain([0, 8]) //the x-axis range
                      .range([0, VIS_WIDTH]);

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const Y_SCALE = d3.scaleLinear() 
                      .domain([0, 7]) // the y-axis range
                      .range([VIS_HEIGHT,0]);

    // The colors for each species type
    const colors = d3.scaleOrdinal().domain(data).range(["steelblue", "mediumaquamarine", "salmon"])  

    // Plots the petal and sepal length points with 50% opacity and 
    // colors accordingly to species type
    const circles = FRAME1.selectAll("points")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X_SCALE(d.Sepal_Length) + MARGINS.left); }) 
          .attr("cy", (d) => { return (Y_SCALE(d.Petal_Length) + MARGINS.top); }) 
          .attr("r", 4)
          .attr('id', (d) => {
            return d.id
        })
          .attr("class", "point")
          .attr("fill", function(d){return colors(d.Species)})
          .attr("opacity", "50%");

    // adds x axis labels
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE).ticks(8)) 
            .attr("font-size", '10px');

    // adds y axis labels
    FRAME1.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + MARGINS.top + ")")
          .call(d3.axisLeft(Y_SCALE).ticks(14)) 
            .attr("font-size", '10px');
    
    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const X_SCALE2 = d3.scaleLinear() 
                      .domain([0, 5]) // the x-axis range of points
                      .range([0, VIS_WIDTH]);

    // Define scale functions that maps our data values 
    // (domain) to pixel values (range)
    const Y_SCALE2 = d3.scaleLinear() 
                      .domain([0, 3]) // the y-axis range of points
                      .range([VIS_HEIGHT,0]);  

    // Plots the petal and sepal width points with 50% opacity and 
    // colors accordingly to species type
    const circles2 = FRAME2.selectAll("points")  
        .data(data) // passed from .then  
        .enter()       
        .append("circle")  
          .attr("cx", (d) => { return (X_SCALE2(d.Sepal_Width) + MARGINS.left); }) 
          .attr("cy", (d) => { return (Y_SCALE2(d.Petal_Width) + MARGINS.top); }) 
          .attr("r", 4)
          .attr("class", "point")
          .attr('id', (d) => {
            return d.id
        })
          .attr("fill", function(d){return colors(d.Species)})
          .attr("opacity", "50%");

    // adds x axis labels
    FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + (VIS_HEIGHT + MARGINS.top) + ")") 
          .call(d3.axisBottom(X_SCALE2).ticks(10)) 
            .attr("font-size", '10px');

    // adds y axis labels
    FRAME2.append("g") 
          .attr("transform", "translate(" + MARGINS.left + 
                "," + MARGINS.top + ")")
          .call(d3.axisLeft(Y_SCALE2).ticks(15)) 
            .attr("font-size", '10px');

    // The data for each type of species
    const data2 = [
      { species: 'virginica', count: 50 },
      { species: 'versicolor', count: 50 },
      { species: 'setosa', count: 50 }
    ];

    // Define scale functions that maps our data values 
    // Provides some space between each line on the bar graph
    const X_SCALE3 = d3.scaleBand()
      .domain(data2.map(function(d) { return d.species; }))
      .range([0, VIS_WIDTH])
      .padding(0.2);

    // Define scale functions that maps our data values 
    const Y_SCALE3 = d3.scaleLinear()
      .domain([0, 60]) // y-axis range is set to 60
      .range([VIS_HEIGHT, 0]);

    // Each color for the species type
    const colors2 = d3.scaleOrdinal().domain(data2).range(["mediumaquamarine", "steelblue", "salmon"])

    //Allows the bar graph alligned with the other graph
    const g = FRAME3.append("g")
               .attr("transform", "translate(" + MARGINS.top + "," + MARGINS.left + ")");

    //Put the x-axis on the bottom of the graph
    g.append("g")
     .attr("transform", "translate(0," + VIS_HEIGHT + ")")
     .call(d3.axisBottom(X_SCALE3));

    //Put the y-axis on the side of the graph
    g.append("g")
     .call(d3.axisLeft(Y_SCALE3).ticks(10))
        .attr("font-size", "10px");

    // Creates the svg element with the axes and bar lines filled in with a color
    // according to the color of the alloted species type
    bars = g.selectAll()
     .data(data2)
     .enter()
     .append("rect")
        .attr('x', d => X_SCALE3(d.species))
        .attr('y', function(d) { return Y_SCALE3(d.count); })
        .attr('width', X_SCALE3.bandwidth())
        .attr('height', function(d) { return VIS_HEIGHT - Y_SCALE3(d.count); })
        .attr('fill', function(d) {return colors(d.species)})
        .attr("opacity", "50%");




    FRAME2.call(
      d3.brush()
      .extent( [ [0,0], [FRAME_WIDTH,FRAME_HEIGHT] ] )// initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    )

    function updateChart(event) {
      const extent = event.selection;
      
      circles2.classed("selected", d => {
        const x = X_SCALE2(d.Sepal_Width) + MARGINS.left;
        const y = Y_SCALE2(d.Petal_Width) + MARGINS.top;
        return isBrushed(extent, x, y);
      });
      
      const selection = FRAME2.selectAll(".selected").nodes();
      const selectionIds = selection.map(node => node.id);
      const selectionSpecies = selection.map(node => node.getAttribute('species'));
      
      circles.classed("selected", d => selectionIds.includes(d.id));
  }

  // A function that return TRUE or FALSE according if a dot is in the selection or not
    function isBrushed(brush_coords, cx, cy) {
         var x0 = brush_coords[0][0],
             x1 = brush_coords[1][0],
             y0 = brush_coords[0][1],
             y1 = brush_coords[1][1];
        return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    }

    

  });
}

// builds scatter plot
build_scatter_plot();


////////////////////////////////////////////////////////////////////////////////////
// Add brushing to the first visualization

