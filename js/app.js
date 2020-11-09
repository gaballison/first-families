//---------------------------------------
//  VARIABLES
//---------------------------------------
let html = document.getElementById('results');
const pagination = document.getElementById('pagination');
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
        
        html.innerHTML += `
            <table id="main-table">
                <thead>
                    <tr>
                        <th>Name <i class="fas fa-sort fa-lg sort" id="col-name"></i></th>
                        <th>County <i class="fas fa-sort fa-lg sort" id="col-county"></i></th>
                        <th>First Year <i class="fas fa-sort fa-lg sort" id="col-year"></i></th>
                        <th>Total Applicants <i class="fas fa-sort fa-lg sort" id="col-apps"></i></th>
                    </tr>
                </thead>
                <tbody>`;

        // add click event handlers?!
        let name = document.getElementById('col-name');
        name.addEventListener('click', () => {
            console.log(`You clicked the sorting tool that doesn't work yet!`)
        });

        data.forEach(obj => testTable(obj));

        html.innerHTML += `</tbody></table>`;

  });


//---------------------------------------
//  HELPER FUNCTIONS
//---------------------------------------

function testTable(object) {
    let table = document.getElementById("main-table").getElementsByTagName("tbody")[0];
    let newRow = table.insertRow();

    // construct name
    let row = `<td>${makeName(object)}</td>`;

    // get county (or counties)
    row += `<td>${makeCounty(object)}</td>`

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
        fullName += ` (${object['maiden_name']})`
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
//  EVENT HANDLERS
//---------------------------------------
function sortName() {
    const btn = document.getElementById('col-name');
    btn.addEventListener('click', event => {
        // sort stuff alpha by name
    })
}

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

DisplayList(list_items, list_element, rows, current_page);
SetupPagination(list_items, pagination_element, rows);

// source: https://github.com/TylerPottsDev/vanillajs-pagination/blob/master/main.js
