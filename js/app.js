//---------------------------------------
//  VARIABLES
//---------------------------------------
let html = document.getElementById('results');


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
        
        html.innerHTML += `<table id="main-table"><thead><tr><th>Name <i class="fas fa-sort fa-lg sort" id="col-name"></i></th><th id="col-county">County</th><th id="col-year">First Year</th><th id="col-apps">Total Applicants</th></tr></thead><tbody>`;

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

