# First Families

This is my capstone project for the Javascript Development track of Code Louisville in September 2020. 

## Description

This application takes data for all of the ancestors used in 2013-2019 applications to join the [First Families of Floyd, Clark, &amp; Harrison Counties](https://sigsweb.org/firstfamilies) and displays a list of all ancestors. There are options to filter the list by application year or a specific county, as well as a search box to look up a particular ancestor or name.

## Required Features 

Here are the features I intend to implement from the [list of project requirements](https://docs.google.com/document/d/1Jtlow4tOOvxB0Vas0rOUueD4cEo6nOn5YN8zvItra6g/edit):

| Requirement | My feature |
|-------------|------------|
| Read and parse an external file (such as JSON or CSV) into your application and display some data from that in your app | Fetches `FFancestors.json` on line **25** and displays that data in various permutations throughout the file using functions like `buildTable()` and `makeRows()` |
| Create an array, dictionary or list, populate it with multiple values, retrieve at least one value, and use or display it in your application | `getData()` function loops through the fetched JSON data and 
- Creates a new object for each application year
- Updates subtotals for each year based on number of applicants by county
- Pushes the new object to the `yearTotals` or `countyTotals` array

The `makeStatsDiv()` function takes arguments for a year or county and then generates divs to display the stats for the given year or county from the relevant array |
| Calculate and display data based on an external factor | Adds a countdown clock to display time remaining until the August 15, 2021 application deadline |

- [x] Read and parse an external file (such as JSON or CSV) into your application and display some data from that in your app
- [ ] Create 3 or more unit tests for your application (and document how to run them)
- [x] Create an array, dictionary or list, populate it with multiple values, retrieve at least one value, and use or display it in your application
- [x] Calculate and display data based on an external factor (ex: get the current date, and display how many days remaining until some event) 

## Instructions

Add more here.

