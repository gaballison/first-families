(function () {
   'use strict';

   document.addEventListener('DOMContentLoaded', () => {

       //---------------------------------------
       //  MODULES
       //---------------------------------------
       //import * as d3 from "d3.mjs";
       //const d3 = require('d3');


       //---------------------------------------
       //  GLOBAL VARIABLES
       //---------------------------------------
       let html = document.getElementById('results');
       let dataList = [];
       let resultsHeader = document.getElementById('resultsHeader');
       let statsDiv = document.getElementById('statsDiv');
       let yearObj = {};
       let countyTotals =  {
           'Total': 0,
           'Floyd': 0,
           'Clark': 0,
           'Harrison': 0
       };
       const viewYear = document.getElementById('view-year');
       const viewCounty = document.getElementById('view-county');
       const pagination = document.getElementById('pagination');
       const navForm = document.getElementById('searchFilter');
       const mainSearch = document.getElementById('mainSearch');


       //---------------------------------------
       //  FETCH THE DATA
       //---------------------------------------

       // initial fetch of entire data
       fetch('./data/FFAncestors.json')
           .then(function(response) {
               if (!response.ok) {
                   throw new Error(`HTTP error! status: ${response.status}`);
               }
               return response.json();
           })
           .then(data => {

               // Build the table of initial data
               buildTable(data);
               dataList = data;

               // Generate the data for visualizations
               getData();
               makeStatsDiv();

           });

       
       function fetchData(dataFunction) {
           fetch('./data/FFAncestors.json')
           .then(function(response) {
               if (!response.ok) {
                   throw new Error(`HTTP error! status: ${response.status}`);
               }
               return response.json();
           })
           .then(data => dataFunction(data));
           
       }

       // filtering data
       function filterData(filter, value) {
           //fetchData();
           beginTable();

           // return subset of data that only matches specified filter
           let filteredData = [];

           if (filter === 'county') {
               // match on primary_county or secondary_county
               filteredData = dataList.filter( obj => obj.primary_county === value || obj.secondary_county === value);
               resultsHeader.innerHTML = `Showing <span class="highlight">${filteredData.length}</span> results in <span class="highlight">${value}</span> County`;
               makeStatsDiv(value);
           } else if (filter === 'year') {
               filteredData = dataList.filter( obj => obj[value] > 0);
               resultsHeader.innerHTML = `Showing the <span class="highlight">${filteredData.length}</span> ancestors from the <span class="highlight">${value}</span> cohort`;
               makeStatsDiv(parseInt(value));
           }

           const sortedData = filteredData.sort(sortSurnameAsc);
           sortedData.forEach(obj => makeRows(obj));
           
           html.innerHTML += `</tbody></table>`;
       }

       /**
        * Function to search the JSON data for given input
        * @param {string} name - Name input from #genericSearch input field
        */
       function searchData(name) {
           // Get the data
           fetchData();
           //console.dir(dataList);

           // Start building the table
           beginTable();

           // Split the input into individual words
           const words = name.split(" ");
           const wLength = words.length;
           const surname = words[wLength-1].toUpperCase();
           let searchNames = [];

           // Loop through the initial data array
           for (let i = 0; i < dataList.length; i++) {
               const ancestor = dataList[i];

               // If they entered more than 1 search term, divvy it up to search by surname first
               if (wLength > 1) {

                   if ( ancestor.surname.toUpperCase().includes(surname) || ancestor.maiden_name.toUpperCase().includes(surname) ) {
                       console.log(`Yay, we have a surname match for ${surname}`);

                       const shortArray = words.slice(0,(wLength-1));
                       console.log(`The new short array is ${shortArray}`);

                       shortArray.forEach(word => {
                           if (ancestor.first_name.toUpperCase().includes(word.toUpperCase()) || ancestor.middle_name.toUpperCase().includes(word.toUpperCase())) {
                               console.log(`We have a match in the short array for ${word}`);

                               searchNames.push(ancestor);
                           }
                       });
                   }
               // otherwise search multiple fields for instances of that single term
               } else {
                   
                   if(ancestor.first_name.toUpperCase().includes(name.toUpperCase()) || ancestor.middle_name.toUpperCase().includes(name.toUpperCase()) || ancestor.maiden_name.toUpperCase().includes(name.toUpperCase()) || ancestor.surname.toUpperCase().includes(name.toUpperCase())) {
                       
                       searchNames.push(ancestor);
                   }

               }
               
           }

           // Make sure we don't have any duplicates in the array
           const uniqueAncestors = searchNames.filter((v,i,a)=>a.findIndex(t=>(t.ancestor_id === v.ancestor_id))===i);

           // Update header to show number of results + search term
           resultsHeader.innerHTML = `Showing all <span class='highlight'>${uniqueAncestors.length}</span> results for ${name}`;

           // Sort the array alphabetically and then print it
           const sortedData = uniqueAncestors.sort(sortSurnameAsc);
           sortedData.forEach(obj => makeRows(obj));

           html.innerHTML += `</tbody></table>`;

       }

       //---------------------------------------
       //  HELPER FUNCTIONS
       //---------------------------------------

       function beginTable() {
           // Start building the table
           html.innerHTML = `
        <table id="main-table">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>County</th>
                    <th>First Year</th>
                    <th>Applicants</th>
                </tr>
            </thead>
            <tbody>
        `;
           // <th>Name <i class="fad fa-sort-down fa-lg sort" id="col-name" onclick="toSort('name')"></i></th>
           //             <th>County <i class="fas fa-sort fa-lg sort" id="col-county" onclick="toSort('county')"></i></th>
           //             <th>First Year <i class="fas fa-sort fa-lg sort" id="col-year" onclick="toSort('year')"></i></th>
           //             <th>Applicants <i class="fas fa-sort fa-lg sort" id="col-apps" onclick="toSort('applicants')"></i></th>
       }

       function buildTable(data) {
           // Start building the table
           beginTable();

           // Build the header to show how many results in total
           resultsHeader.innerHTML = `Showing all <span class='highlight'>${data.length}</span> approved ancestors`;

           // Sort the data alphabetically by surname
           const sortedData = data.sort(sortSurnameAsc);
           sortedData.forEach(obj => makeRows(obj));
           
           // Close out the table
           html.innerHTML += `</tbody></table>`;
       }

       function makeRows(object) {
           let table = document.getElementById("main-table").getElementsByTagName("tbody")[0];
           let newRow = table.insertRow();

           // construct name
           let row = `<td>${makeName(object)}</td>`;

           // get county (or counties)
           row += `<td>${makeCounty(object)}</td>`;

           // print first year someone joined through that ancestor
           row += `<td>${object['first_added']}</td>`;

           // print total # of people who joined through that ancestor
           row += `<td>${object['total_applicants']}</td>`;

           row += `</tr>`;
           //console.log(`row = ${row}`);
           
           newRow.innerHTML = row;
       }

       function makeName(object) {
           // returns name as string formatted as LAST, Title First Middle (Maiden) Suffix
           // e.g. ARMSTRONG, Captain John Andrew II or HARRIS, Jane Elizabeth (Jones)
           let fullName = `<strong>${object['surname'].toUpperCase()}</strong>, `;

           if (object['title']) {
               fullName += `${object['title']} ${object['first_name']}`;
           } else {
               fullName += `${object['first_name']}`;
           }

           if (object['middle_name']) {
               fullName += ` ${object['middle_name']}`;
           }

           if (object['maiden_name']) {
               fullName += ` <em>(${object['maiden_name']})</em>`;
           }

           if (object['suffix']) {
               fullName += ` ${object['suffix']}`;
           }

           return fullName;
       }

       // sometimes people listed an ancestor in 2 separate counties
       function makeCounty(object) {
           let county = `${object['primary_county']}`;

           if(object['secondary_county']) {
               county += `, ${object['secondary_county']}`;
           }

           return county;
       }


       //---------------------------------------
       //  DATA FOR VISUALIZATIONS
       //---------------------------------------
       function getData() {
           // Fetch data so we can use dataList
           // fetchData();

           // Create new object for each year 2013-2019 
           
           for (let i = 2013; i < 2020; i++) {

               yearObj[i] = { 'total': 0, 'total_new': 0, 'total_existing': 0,'new_floyd': 0, 'new_clark': 0, 'new_harrison': 0, 'existing_floyd': 0, 'existing_clark': 0, 'existing_harrison': 0 };

           }
           // console.dir(yearTotals);
           // console.dir(yearObj);

           for (const year in yearObj) {
               dataList.forEach(person => {
                   if (person[year] > 0) {
                       if (person.first_added === parseInt(year)) {
                           // console.log(`${person.first_name} ${person.surname} first added in ${year}`);
                           switch(person.primary_county) {
                               case 'Floyd':
                                   yearObj[year].new_floyd++;
                                   yearObj[year].total++;
                                   yearObj[year].total_new++;
                                   countyTotals.Floyd++;
                                   countyTotals.Total++;
                                   break;
                               case 'Clark':
                                   yearObj[year].new_clark++;
                                   yearObj[year].total++;
                                   yearObj[year].total_new++;
                                   countyTotals.Clark++;
                                   countyTotals.Total++;
                                   break;
                               case 'Harrison':
                                   yearObj[year].new_harrison++;
                                   yearObj[year].total++;
                                   yearObj[year].total_new++;
                                   countyTotals.Harrison++;
                                   countyTotals.Total++;
                                   break;
                           }
                       } else {
                           // console.log(`${person.first_name} ${person.surname} was used in ${year} but was first added in ${person.first_added}`);
                           switch(person.primary_county) {
                               case 'Floyd':
                                   yearObj[year].existing_floyd++;
                                   yearObj[year].total++;
                                   yearObj[year].total_existing++;
                                   break;
                               case 'Clark':
                                   yearObj[year].existing_clark++;
                                   yearObj[year].total++;
                                   yearObj[year].total_existing++;
                                   break;
                               case 'Harrison':
                                   yearObj[year].existing_harrison++;
                                   yearObj[year].total++;
                                   yearObj[year].total_existing++;
                                   break;
                           }
                       }
                   }
               });
           }
           
       }

       function makeStatsDiv(year, county) {
           console.log(`Year submitted is ${year} (type ${typeof year})`);

           year = parseInt(year);
           statsDiv.innerHTML = '';
           console.dir(yearObj[year]);

           if (year !== undefined && year < 2020 && year > 2012) {
               console.log(`Year is ${year} (type ${typeof year}) so we can fetch all of the data from the object at yearObj[year]: ${yearObj[year]}`);
               // let dummy = `
               //         <div class="stat">
               //             <h2>Total</h2>
               //             <span><strong>${data[total_new]}</strong> new</span>
               //             <span><strong>${data[total_existing]}</strong> new</span>
               //         </div>
               //     `;
               // statsDiv.innerHTML += dummy;
           } else if (county === 'Floyd') ;
           else {
               // count number that contain/include each county
               
               for (const key in countyTotals) {
                   let dummy = `
                    <div class="stat">
                        <h2>${countyTotals[key]}</h2>
                        <span>${key}</span>
                    </div>
                `;
                   statsDiv.innerHTML += dummy;
               }
           }
       }


       //---------------------------------------
       //  COUNTDOWN CLOCK
       //---------------------------------------

       // Set the date we're counting down to
       const cdDate = new Date("Aug 15, 2021 12:00:00");
       const countDownDate = cdDate.getTime();


       // Update the count down every 1 second
       const x = setInterval(function() {

           // Get today's date and time
           const now = new Date().getTime();

           // Find the distance between now and the count down date
           const distance = countDownDate - now;

           // Time calculations for days, hours, minutes and seconds
           const days = Math.floor(distance / (1000 * 60 * 60 * 24));
           const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
           const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
           const seconds = Math.floor((distance % (1000 * 60)) / 1000);

           // Display the result in the element with id="demo"
           document.getElementById("countdown").innerHTML = days + "d " + hours + "h "
           + minutes + "m " + seconds + "s ";
           document.getElementById("countdown").setAttribute('title', cdDate);

           // If the count down is finished, write some text
           if (distance < 0) {
               clearInterval(x);
               document.getElementById("countdown").innerHTML += "PASSED!";
           }
       }, 1000);

      
       //---------------------------------------
       //  SORTING FUNCTIONS
       //---------------------------------------
       function sortSurnameAsc(a, b) {
           if ( a.surname < b.surname ){
               return -1;
           }
           else if ( a.surname > b.surname ){
               return 1;
           }
           return 0;
       }


       //---------------------------------------
       //  EVENT HANDLING
       //---------------------------------------
       navForm.addEventListener('change', event => {
           console.log(`You changed ${event.target.id} to ${event.target.value}!`);
           // then we fetch the data matching that criteria and build a table with the results
           if (event.target.id === 'county') {
               filterData('county', event.target.value);
           } else if (event.target.id === 'joinYear') {
               filterData('year', event.target.value);
           }
           navForm.reset();
       });

       mainSearch.addEventListener('submit', event => {
           event.preventDefault();
           const searchTerm = document.getElementById('genericSearch').value;
           searchData(searchTerm);
       });

       // DisplayList(list_items, list_element, rows, current_page);
       // SetupPagination(list_items, pagination_element, rows);

       // source: https://github.com/TylerPottsDev/vanillajs-pagination/blob/master/main.js

   });

}());
//# sourceMappingURL=bundle.js.map
