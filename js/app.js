//---------------------------------------
//  VARIABLES
//---------------------------------------
let html = document.getElementById('results');
let dataList = [];
const viewYear = document.getElementById('view-year');
const viewCounty = document.getElementById('view-county');
const pagination = document.getElementById('pagination');
const navForm = document.getElementById('searchFilter');
let resultsHeader = document.getElementById('resultsHeader');
let current_page = 1;
let rows = 10;


//---------------------------------------
//  FETCH THE DATA
//---------------------------------------
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
        //data.forEach(obj => testTable(obj));
        
        html.innerHTML += `</tbody></table>`;

        dataList = data;
        
});


function filterData(filter, value) {
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

        // return subset of data that only matches specified filter
        let filteredData = [];

        if (filter === 'county') {
            // match on primary_county or secondary_county
            filteredData = data.filter( obj => obj.primary_county === value || obj.secondary_county === value);
            resultsHeader.innerHTML = `Showing ${filteredData.length} results in ${value} County`;
        } else if (filter === 'year') {
            // match on application year
            // console.log(`Value is ${value} which is type ${typeof value}`)
            filteredData = data.filter( obj => obj.first_added === parseInt(value));
            resultsHeader.innerHTML = `Showing ${filteredData.length} results in ${value}`;
        }

        
        const sortedData = filteredData.sort(SortSurnameAsc);
        sortedData.forEach(obj => TestTable(obj));
        
        html.innerHTML += `</tbody></table>`;
        
  });
}

function sortData(filter, value) {
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

        // return subset of data that only matches specified filter
        let filteredData = [];

        if (filter === 'county') {
            // match on primary_county or secondary_county
            filteredData = data.filter( obj => obj.primary_county === value || obj.secondary_county === value);
            resultsHeader.innerHTML = `Showing ${filteredData.length} results in ${value} County`;
        } else if (filter === 'year') {
            // match on application year
            // console.log(`Value is ${value} which is type ${typeof value}`)
            filteredData = data.filter( obj => obj.first_added === parseInt(value));
            resultsHeader.innerHTML = `Showing ${filteredData.length} results in ${value}`;
        }

        
        const sortedData = filteredData.sort(SortSurnameAsc);
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

//---------------------------------------
//  EVENT HANDLING
//---------------------------------------
// viewCounty.addEventListener('click', () => {
//     document.getElementById("county-list").classList.toggle("show");
//     console.log(`You clicked the County button, but it's not working...`)
// });

function ToSort(what) {
    console.log(`You clicked on ${what}`);
}

navForm.addEventListener('change', event => {
    console.log(`You changed ${event.target.id} to ${event.target.value}!`);
    // then we fetch the data matching that criteria and build a table with the results
    if (event.target.id === 'county') {
        filterData('county', event.target.value);
    } else if (event.target.id === 'joinYear') {
        filterData('year', event.target.value);
    }
    event.target.id.selectedIndex = null;
    

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
