const dummy = `This is just some stupid text that I'm going to add to the element in a minute.`;
const html = document.getElementById('results');
html.innerHTML = `<h2>Here is some content I added with JavaScript</h2>`;

function makeTable(obj) {
    html.innerHTML += dummy;
    html.innerHTML += `<table><thead><tr><th>Name</th><th>County</th><th>First Year</th><th>Total Applicants</th></tr></thead><tbody>`;

    for(const prop in obj) {
        
        html.innerHTML += `<tr>`;

        // construct name
        html.innerHTML += `<td>${makeName(obj[prop])}</td>`;

        // get county (or counties)
        html.innerHTML += `<td>${makeCounty(obj[prop])}</td>`

        html.innerHTML += `</tr>`;
    }
    html.innerHTML += `</tbody></table>`;
}

function makeName(object) {
    // returns name as string formatted as LAST, Title First Middle (Maiden) Suffix
    // e.g. ARMSTRONG, Captain John Andrew II
    let fullName = `<strong>${object.Surname}</strong>, `;

    if (object.Title) {
        fullName += `${object.Title} ${object['First Name']}`;
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
        fullName += ` ${object.Suffix}`;
    }

    return fullName;
}

function makeCounty(object) {
    let county = `${object['PRIMARY County']}`;

    if(object['Secondary County']) {
        county += `, ${object['Secondary County']}`;
    }

    return county;
}

// Get the FF Ancestors data
// need to add some error handling
fetch('./data/FFAncestorsThru2019.json')
//   .then(response => response.json())
    .then(function(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // map over shit 
        // except it's not an array so instead we do this
        makeTable(data);

  });

