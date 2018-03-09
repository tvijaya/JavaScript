// Set ufoData to dataSet initially
// dataSet comes from the dataSet.js file
var ufoData = dataSet;

// Get references to the tbody element, input field and button
var $tbody = document.querySelector('tbody');

var $dateInput = d3.select('#date-input');
var $stateInput = d3.select('#state-input');
var $cityInput = d3.select('#city-input');
var $countryOptions = d3.select('#countrySelect');
var $shapeOptions = d3.select('#shapeSelect');
var $pageOptions = d3.select('#pageSelect');
var $pageNumbers = d3.select('.my-page-numbers');



$dateInput.on('change',handleSearchButtonClick);
$stateInput.on('change',handleSearchButtonClick);
$cityInput.on('change',handleSearchButtonClick);
$countryOptions.on('change',handleSearchButtonClick);
$shapeOptions.on('change',handleSearchButtonClick);

// update the table contents when user changes the number of records to be displayed
$pageOptions.on('change', renderTable);

var page = 1;
var recordsPerPage = $pageOptions.property('value');


// renderTable renders the ufoData to the tbody
function renderTable() {

  recordsPerPage = $pageOptions.property('value');
  
  // based on the page number and number of records to be displayed, slice the dataset and display the content
  var filteredData = ufoData.slice(((page-1) * recordsPerPage), (page *recordsPerPage)); 
  $tbody.innerHTML = '';
  for (var i = 0; i < filteredData.length; i++) {
    // Get get the current address object and its fields
    var address = filteredData[i];
    var fields = Object.keys(address);
    // Create a new row in the tbody, set the index to be i + startingIndex
    var $row = $tbody.insertRow(i);
    for (var j = 0; j < fields.length; j++) {
      // For every field in the address object, create a new cell at set its inner text to be the current value at the current address's field
      var field = fields[j];
      var $cell = $row.insertCell(j);
      $cell.innerText = address[field];
    }
  }
}

function handleSearchButtonClick() {
  // everytime filter criteria changes, get the actual data set and based on the filter fields update the ufoData, which is to be displayed
  ufoData = dataSet;

  if($stateInput.node().value){
    var filterWord = $stateInput.node().value.toLowerCase();
    // Set ufoData to an array of all addresses whose "state" matches the filter
    ufoData = ufoData.filter(function(address) {
      var state = address.state;
      // If true, add the address to the ufoData, otherwise don't add it to ufoData
      return state === filterWord;
    });
  }

  if($dateInput.node().value){
    var filterWord = $dateInput.node().value.toLowerCase();
    // Set ufoData to an array of all addresses whose "datetime" matches the filter
    ufoData = ufoData.filter(function(address) {
      var datetime = address.datetime;
  
      // If true, add the address to the ufoData, otherwise don't add it to ufoData
      return datetime === filterWord;
    });
  }

  if($cityInput.node().value){
    var filterWord = $cityInput.node().value.toLowerCase();
    // Set ufoData to an array of all addresses whose "city" matches the filter
    ufoData = ufoData.filter(function(address) {
      var city = address.city;
  
      // If true, add the address to the ufoData, otherwise don't add it to ufoData
      //return city === filterWord;
      return city.includes(filterWord);
    });
  }

  if($countryOptions.property("value")){
    var filterWord = $countryOptions.property("value");
    // Set ufoData to an array of all addresses whose "country" matches the filter
    if(filterWord != "all"){
      ufoData = ufoData.filter(function(address) {
        var country = address.country;
    
        // If true, add the address to the ufoData, otherwise don't add it to ufoData
        return country === filterWord;
      });
    }
  }

  if($shapeOptions.property("value")){
    var filterWord = $shapeOptions.property("value");
    // Set ufoData to an array of all addresses whose "shape" matches the filter
    if(filterWord != "all"){
      ufoData = ufoData.filter(function(address) {
        var shape = address.shape;
    
        // If true, add the address to the ufoData, otherwise don't add it to ufoData
        return shape === filterWord;
      });
    }
  }
  // after obtaining the filter data, update the table and the footer
  displayPageFooter();
  renderTable();
}

function getUniqueCountries(){
  var distinct = [];
  distinct = ufoData.map(item => item.country)
              .filter((value, index, self) => self.indexOf(value) === index)
  $countryOptions.html("");
  if(distinct.length > 1){
    $countryOptions.append('option').text('all');
  }
  for( i =0; i< distinct.length; i++){
    $countryOptions.append('option').text(distinct[i]).property('value', distinct[i]);
  }
}

function getUniqueShapes(){
  var distinct = [];
  // get distinct shapes 
  distinct = ufoData.map(item => item.shape)
              .filter((value, index, self) => self.indexOf(value) === index)
  $shapeOptions.html("");
  if(distinct.length > 1){
    $shapeOptions.append('option').text('all');
  }
  for( i =0; i< distinct.length; i++){
    $shapeOptions.append('option').text(distinct[i]).property('value', distinct[i]);
  }

}

//display pagination based on number of records to be displayed per page
function displayPageFooter(){
  var records_per_page= $pageOptions.property("value");
  var numItems = ufoData.length;
  var numPages = Math.ceil(numItems/records_per_page);
  var $myLi = d3.select('.my-page-numbers');
  $myLi.html("");
  if(numPages > 1)
    $myLi.append('li').attr('class', 'page-item').append('a').attr('class', 'page-link').attr('href', '#').text("Prev");
  
    if(numPages < 10){
      for (let i=1; i<=numPages; i++){
        $myLi.append('li').attr('class', 'page-item').append('a').attr('class', 'page-link').attr('href', '#').text(i);
      }
    }else{
      for (let i=1; i<=9; i++){
        $myLi.append('li').attr('class', 'page-item').append('a').attr('class', 'page-link').attr('href', '#').text(i);
      }
      $myLi.append('li').attr('class', 'page-item').append('a').attr('class', 'page-link').attr('href', '#').text(".......");     
    }
  if(numPages > 1)
    $myLi.append('li').attr('class', 'page-item').append('a').attr('class', 'page-link').attr('href', '#').text("Next");
  addMyEvents();
}

// add event listeners to the pagination elements
function addMyEvents(){
var myAnchors = document.getElementsByTagName("a");

for (var i = 0; i < myAnchors.length ; i++) {
  myAnchors[i].addEventListener("click", function (event) {
            event.preventDefault();
            
            
            var records_per_page= $pageOptions.property("value");
            var numItems = ufoData.length;
            var numPages = Math.ceil(numItems/records_per_page);

            //get the number of the page clicked
            var mypage = event.srcElement.firstChild.data;
            if (mypage == "Prev" ){
              if(page > 1)
                page = parseInt(page) - 1;
              else
              page = 1;
            }else if( mypage == "Next" ){
              if(page < numPages)
                page= parseInt(page) + 1;
              else
                page = page;
            }else if(mypage != "......."){
              page = mypage;
            }
            renderTable();
        });
}
}


// render table for the first time
getUniqueCountries();
getUniqueShapes();
displayPageFooter();
renderTable();



//===================================================//

