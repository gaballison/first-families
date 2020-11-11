//---------------------------------------
//  VARIABLES
//---------------------------------------
let html = document.getElementById('results');
let dataList = [];
const viewYear = document.getElementById('view-year');
const viewCounty = document.getElementById('view-county');
const pagination = document.getElementById('pagination');
const navForm = document.getElementById('searchFilter');
const mainSearch = document.getElementById('mainSearch');
let resultsHeader = document.getElementById('resultsHeader');
let current_page = 1;
let rows = 10;


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
        
        html.innerHTML = `
            <table id="main-table">
                <thead>
                    <tr>
                        <th>Name <i class="fad fa-sort-down fa-lg sort" id="col-name" onclick="ToSort('name')"></i></th>
                        <th>County <i class="fas fa-sort fa-lg sort" id="col-county" onclick="ToSort('county')"></i></th>
                        <th>First Year <i class="fas fa-sort fa-lg sort" id="col-year" onclick="ToSort('year')"></i></th>
                        <th>Total Applicants <i class="fas fa-sort fa-lg sort" id="col-apps" onclick="ToSort('applicants')"></i></th>
                    </tr>
                </thead>
                <tbody>
        `;

        // display data initially
        // TEST SORT
        resultsHeader.innerHTML = `Showing all ${data.length} approved ancestors`;
        const sortedData = data.sort(SortSurnameAsc);
        sortedData.forEach(obj => TestTable(obj));
        
        html.innerHTML += `</tbody></table>`;

        // now that we've successfully returned the data, set it in a variable
        dataList = data;
        
});


// filtering data
function filterData(filter, value) {
    html.innerHTML = `
        <table id="main-table">
            <thead>
                <tr>
                    <th>Name <i class="fad fa-sort-down fa-lg sort" id="col-name" onclick="ToSort('name')"></i></th>
                    <th>County <i class="fas fa-sort fa-lg sort" id="col-county" onclick="ToSort('county')"></i></th>
                    <th>First Year <i class="fas fa-sort fa-lg sort" id="col-year" onclick="ToSort('year')"></i></th>
                    <th>Total Applicants <i class="fas fa-sort fa-lg sort" id="col-apps" onclick="ToSort('applicants')"></i></th>
                </tr>
            </thead>
            <tbody>
    `;

    // return subset of data that only matches specified filter
    let filteredData = [];

    if (filter === 'county') {
        // match on primary_county or secondary_county
        filteredData = dataList.filter( obj => obj.primary_county === value || obj.secondary_county === value);
        resultsHeader.innerHTML = `Showing ${filteredData.length} results in ${value} County`;
    } else if (filter === 'year') {
        // match on application year
        // console.log(`Value is ${value} which is type ${typeof value}`)
        // filteredData = dataList.filter( obj => obj.first_added === parseInt(value));
        
        filteredData = dataList.filter( obj => obj[value] > 0);
        resultsHeader.innerHTML = `Showing the ${filteredData.length} ancestors from the ${value} cohort`;
    }

    
    const sortedData = filteredData.sort(SortSurnameAsc);
    sortedData.forEach(obj => TestTable(obj));
    
    html.innerHTML += `</tbody></table>`;
}

function sortData(filter, value, sortMethod) {
    
    html.innerHTML = `
        <table id="main-table">
            <thead>
                <tr>
                    <th>Name <i class="fad fa-sort-down fa-lg sort" id="col-name" onclick="ToSort('name')"></i></th>
                    <th>County <i class="fas fa-sort fa-lg sort" id="col-county" onclick="ToSort('county')"></i></th>
                    <th>First Year <i class="fas fa-sort fa-lg sort" id="col-year" onclick="ToSort('year')"></i></th>
                    <th>Total Applicants <i class="fas fa-sort fa-lg sort" id="col-apps" onclick="ToSort('applicants')"></i></th>
                </tr>
            </thead>
            <tbody>
    `;

    // return subset of data that only matches specified filter
    let filteredData = [];

    if (filter === 'county') {
        // match on primary_county or secondary_county
        filteredData = dataList.filter( obj => obj.primary_county === value || obj.secondary_county === value);
        resultsHeader.innerHTML = `Showing ${filteredData.length} results in ${value} County`;
    } else if (filter === 'year') {
        // match on application year
        // console.log(`Value is ${value} which is type ${typeof value}`)
        filteredData = dataList.filter( obj => obj.first_added === parseInt(value));
        resultsHeader.innerHTML = `Showing ${filteredData.length} results in ${value}`;
    }

    
    const sortedData = filteredData.sort(SortSurnameAsc);
    sortedData.forEach(obj => TestTable(obj));
    
    html.innerHTML += `</tbody></table>`;
        
}

function SearchData(name) {
    fetch('./data/FFAncestors.json')
    .then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        
        // Start building the table
        html.innerHTML = `
            <table id="main-table">
                <thead>
                    <tr>
                        <th>Name <i class="fad fa-sort-down fa-lg sort" id="col-name" onclick="ToSort('name')"></i></th>
                        <th>County <i class="fas fa-sort fa-lg sort" id="col-county" onclick="ToSort('county')"></i></th>
                        <th>First Year <i class="fas fa-sort fa-lg sort" id="col-year" onclick="ToSort('year')"></i></th>
                        <th>Total Applicants <i class="fas fa-sort fa-lg sort" id="col-apps" onclick="ToSort('applicants')"></i></th>
                    </tr>
                </thead>
                <tbody>
        `;

        // Split the input into individual words
        const words = name.split(" ");
        const wLength = words.length;
        const surname = words[wLength-1].toUpperCase();
        let searchNames = [];

        // Loop through the initial data array
        for (let i = 0; i < data.length; i++) {
            const ancestor = data[i];

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
        resultsHeader.innerHTML = `Showing all ${uniqueAncestors.length} results for ${name}`;

        // Sort the array alphabetically and then print it
        const sortedData = uniqueAncestors.sort(SortSurnameAsc);
        sortedData.forEach(obj => TestTable(obj));

        html.innerHTML += `</tbody></table>`;
        
    });
}

//---------------------------------------
//  HELPER FUNCTIONS
//---------------------------------------

function TestTable(object) {
    let table = document.getElementById("main-table").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow();

    // construct name
    let row = `<td>${MakeName(object)}</td>`;

    // get county (or counties)
    row += `<td>${MakeCounty(object)}</td>`

    // print first year someone joined through that ancestor
    row += `<td>${object['first_added']}</td>`;

    // print total # of people who joined through that ancestor
    row += `<td>${object['total_applicants']}</td>`;

    row += `</tr>`;
    //console.log(`row = ${row}`);
    
    newRow.innerHTML = row;
}

function MakeName(object) {
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
        fullName += ` (${object['maiden_name']})`
    }

    if (object['suffix']) {
        fullName += ` ${object['suffix']}`;
    }

    return fullName;
}

// sometimes people listed an ancestor in 2 separate counties
function MakeCounty(object) {
    let county = `${object['primary_county']}`;

    if(object['secondary_county']) {
        county += `, ${object['secondary_county']}`;
    }

    return county;
}


//---------------------------------------
//  SORTING FUNCTIONS
//---------------------------------------

function SortSurnameAsc(a, b) {
    if ( a.surname < b.surname ){
        return -1;
    }
    else if ( a.surname > b.surname ){
        return 1;
    }
    return 0;
}

function SortFirstNameAsc(a, b) {
    if ( a.first_name < b.first_name ){
        return -1;
    }
    else if ( a.first_name > b.first_name ){
        return 1;
    }
    return 0;
}

function SortApps(a, b) {
    if ( a.first_added < b.first_added ){
        return -1;
    }
    else if ( a.first_added > b.first_added ){
        return 1;
    }
    return 0;
}

//---------------------------------------
//  EVENT HANDLING
//---------------------------------------
// viewCounty.addEventListener('click', () => {
//     document.getElementById("county-list").classList.toggle("show");
//     console.log(`You clicked the County button, but it's not working...`)
// });

function ToSort(what) {
    console.log(`You clicked on ${what}`);
    if (what === 'applicants') {

    }

}

navForm.addEventListener('change', event => {
    console.log(`You changed ${event.target.id} to ${event.target.value}!`);
    // then we fetch the data matching that criteria and build a table with the results
    if (event.target.id === 'county') {
        filterData('county', event.target.value);
        event.target.id.selectedIndex = null;
    } else if (event.target.id === 'joinYear') {
        filterData('year', event.target.value);
        event.target.id.selectedIndex = null;
    }
});

mainSearch.addEventListener('submit', event => {
    event.preventDefault();
    const searchTerm = document.getElementById('genericSearch').value;
    console.log(`You want to search for ${searchTerm}`);
    SearchData(searchTerm);
});



//---------------------------------------
//  PAGINATION
//---------------------------------------
function DisplayList (items, wrapper, rows_per_page, page) {
	wrapper.innerHTML = "";
	page--;

	let start = rows_per_page * page;
	let end = start + rows_per_page;
	let paginatedItems = items.slice(start, end);

	for (let i = 0; i < paginatedItems.length; i++) {
		let item = paginatedItems[i];

		let item_element = document.createElement('div');
		item_element.classList.add('item');
		item_element.innerText = item;
		
		wrapper.appendChild(item_element);
	}
}

function SetupPagination (items, wrapper, rows_per_page) {
	wrapper.innerHTML = "";

	let page_count = Math.ceil(items.length / rows_per_page);
	for (let i = 1; i < page_count + 1; i++) {
		let btn = PaginationButton(i, items);
		wrapper.appendChild(btn);
	}
}

function PaginationButton (page, items) {
	let button = document.createElement('button');
	button.innerText = page;

	if (current_page == page) button.classList.add('active');

	button.addEventListener('click', function () {
		current_page = page;
		DisplayList(items, list_element, rows, current_page);

		let current_btn = document.querySelector('.pagenumbers button.active');
		current_btn.classList.remove('active');

		button.classList.add('active');
	});

	return button;
}

// DisplayList(list_items, list_element, rows, current_page);
// SetupPagination(list_items, pagination_element, rows);

// source: https://github.com/TylerPottsDev/vanillajs-pagination/blob/master/main.js
