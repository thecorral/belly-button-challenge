// Initialize the page
function init() {
  getData();
}

// Get the data from the JSON file
function getData() {
  const dataURL = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

  d3.json(dataURL).then(dataSeparated);
}


//"On change" listener
d3.selectAll("#selDataset").on("change", function() {
  const dataset = d3.select(this).property("value");
  getData(dataset);
});

//Populates data and dropdown menu on initial page load
function dataSeparated(data){
  const nameID = Object.values(data.names);
  createOptions(nameID);

  const samples = Object.values(data.samples);
  createGraphs(940, samples);

  const metaData = Object.values(data.metadata);
  cardData(940, metaData);
};

//Repopulates data upon change selection
function refreshData(data, dataset) {
  const samples = Object.values(data.samples);
  createGraphs(dataset, samples);

  const metaData = Object.values(data.metadata);
  cardData(dataset, metaData);
}

//Populates the dropdown menu
function createOptions(namesList){
  let optionslist = "";
  for (let i = 0; i < namesList.length; i++) {
    optionslist += `<option value="${namesList[i]}">${namesList[i]}</option>`;
  }
  
  d3.select("#selDataset").html(optionslist);
}

//Changes card data
function cardData(metaArg, objectArray) {
  let cardBody = "";
  const objectItem = objectArray.filter(x => x.id == metaArg);
  const itemKeys = Object.keys(objectItem[0]);
  const itemValues = Object.values(objectItem[0]);
  for (let i = 0; i < itemKeys.length; i++) {
    cardBody += `<div>${itemKeys[i]}: ${itemValues[i]}</div>`;
  }
  
  d3.select(".panel-body").html(cardBody);

  const gaugeData = [{
    domain: { x: [0, 1], y: [0, 1] },
    value: objectItem[0].wfreq,
    title: { text: "Weekly Belly Button Washing Frequency" },
    type: "indicator",
    mode: "gauge+number",
    gauge: {
      axis: { range: [null, 9] },
      steps: [
        { range: [0, 3], color: "lightgray" },
        { range: [3, 6], color: "darkgray"},
        { range: [6, 9], color: "gray"}
      ]
    }
  }];

  Plotly.newPlot('gauge', gaugeData);
}

//Populates bar and bubble graphs
function createGraphs(nameArg, objectArray) {
   
  let objectItem = objectArray.filter(x => x.id == nameArg);
  console.log(objectItem);
  let sample_values = objectItem[0].sample_values
  let sample_values10 = sample_values.slice(0,10).reverse();
  
  //Console.log(values);
  let otu_ids = objectItem[0].otu_ids
  let otu_ids10 = otu_ids.slice(0,10).map(item => { return 'OTU '+ item}).reverse();
  
  //Console.log(ids);
  let otu_labels = objectItem[0].otu_labels
  let otu_labels10 = otu_labels.slice(0,10).reverse();
  
  //Console.log(labels);
  let data = [{
    type: 'bar',
    text: otu_labels10,
    x: sample_values10,
    y: otu_ids10,
    orientation: 'h'
  }]

  Plotly.newPlot('bar', data);
    
  let data2 = [{
    x: otu_ids,
    y: sample_values,
    text: otu_labels,
    mode: 'markers',
    marker: {
      color: otu_ids,
      size: sample_values
    }
  }];

  Plotly.newPlot('bubble', data2);

}

//Define optionChanged inline function
function optionChanged() {
};

init();
