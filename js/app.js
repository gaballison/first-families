//---------------------------------------
//  VARIABLES
//---------------------------------------
let html = document.getElementById('results');
let testData = [];


//---------------------------------------
//  FETCH THE DATA
//---------------------------------------
fetch('./data/FFAncestorsThru2019.json')
//   .then(response => response.json())
    .then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        html.innerHTML += `<table><thead><tr><th>Name</th><th>County</th><th>First Year</th><th>Total Applicants</th></tr></thead><tbody>`;

        data.forEach(obj => testTable(obj));

        html.innerHTML += `</tbody></table>`;

        // makeTable(data);
        // console.log(data);

  });


//---------------------------------------
//  HELPER FUNCTIONS
//---------------------------------------

function testTable(object) {
    let row = `<tr>`;

    // construct name
    row += `<td>${makeName(object)}</td>`;

    // get county (or counties)
    row+= `<td>${makeCounty(object)}</td>`

    // print first year someone joined through that ancestor
    row += `<td>${object['FIRST ADDED']}</td>`;

    // print total # of people who joined through that ancestor
    row += `<td>${object['Total Applicants Using This Ancestor']}</td>`;

    row += `</tr>`;
    console.log(`row = ${row}`);
    html.innerHTML += row;
}

// this was the original function
function makeTable(obj) {
    html.innerHTML += dummy;
    html.innerHTML += `<table><thead><tr><th>Name</th><th>County</th><th>First Year</th><th>Total Applicants</th></tr></thead><tbody>`;

    for(const prop in obj) {
        
        html.innerHTML += `<tr>`;

        // construct name
        html.innerHTML += `<td>${makeName(obj[prop])}</td>`;

        // get county (or counties)
        html.innerHTML += `<td>${makeCounty(obj[prop])}</td>`

        // print first year someone joined through that ancestor
        html.innerHTML += `<td>${obj[prop]['FIRST ADDED']}</td>`;

        // print total # of people who joined through that ancestor
        html.innerHTML += `<td>${obj[prop]['Total Applicants Using This Ancestor']}</td>`;

        html.innerHTML += `</tr>`;
    }
    html.innerHTML += `</tbody></table>`;
}

function makeName(object) {
    // returns name as string formatted as LAST, Title First Middle (Maiden) Suffix
    // e.g. ARMSTRONG, Captain John Andrew II or HARRIS, Jane Elizabeth (Jones)
    let fullName = `<strong>${object['Surname'].toUpperCase()}</strong>, `;

    if (object.Title) {
        fullName += `${object['Title']} ${object['First Name']}`;
    } else {
        fullName += `${object['First Name']}`;
    }

    if (object['Middle Name']) {
        fullName += ` ${object['Middle Name']}`;
    }

    if (object['Maiden Name']) {
        fullName += ` (${object['Maiden Name']})`
    }

    if (object.Suffix) {
        fullName += ` ${object['Suffix']}`;
    }

    return fullName;
}

// sometimes people listed an ancestor in 2 separate counties
function makeCounty(object) {
    let county = `${object['PRIMARY County']}`;

    if(object['Secondary County']) {
        county += `, ${object['Secondary County']}`;
    }

    return county;
}



