# First Families

This is my capstone project for the Javascript Development track of Code Louisville in September 2020.

## Description

This application takes data for all of the ancestors used in 2013-2019 applications to join the [First Families of Floyd, Clark, &amp; Harrison Counties](https://sigsweb.org/firstfamilies) and displays a list of all ancestors. There are options to filter the list by application year or a specific county, as well as a search box to look for a particular name.

## Required Features

Here are the features I implemented from the [list of project requirements](https://docs.google.com/document/d/1Jtlow4tOOvxB0Vas0rOUueD4cEo6nOn5YN8zvItra6g/edit):

| Requirement | My feature |
|-------------|------------|
| Read and parse an external file (such as JSON or CSV) into your application and display some data from that in your app | Fetches `FFancestors.json` on line **27** and displays that data in various permutations throughout the file using functions like `buildTable()` and `makeRows()` |
| Create an array, dictionary or list, populate it with multiple values, retrieve at least one value, and use or display it in your application | `getData()` function loops through the fetched JSON data and: (1) creates a new object for each application year; (2) updates subtotals for each year based on number of applicants by county; and (3) pushes the new object to the `yearTotals` or `countyTotals` array. The `makeStatsDiv()` function takes arguments for a year or county and then generates divs to display the stats for the given year or county from the relevant array |
| Calculate and display data based on an external factor | Adds a countdown clock to display time remaining until the August 15, 2021 application deadline |
| Visualize data in a graph, chart, or other visual representation of data | I pull and spotlight various statistics for total new and existing ancestors per year or county using the `getData()` and `makeStatsDiv()` functions |

## Instructions

You can view the project live on GitHub pages at <https://gaballison.github.io/first-families/>.

To run the project locally, you need to run a local server. I personally use [XAMPP](https://www.apachefriends.org/index.html) but if you have [Python](https://www.python.org/) installed, you can also use [the following](https://medium.com/@ryanblunden/create-a-http-server-with-one-command-thanks-to-python-29fcfdcd240e):

- Open a terminal window.
- Navigate to the project directory.
- Execute the command to start the server:
  - Python 2 — `python -m SimpleHTTPServer 8000`
  - Python 3 — `python -m http.server 8000`

Then open a web browser at <http://localhost:8000/>.
