import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';
import User from './js/user.js';
import {updateGlucoseGoal, addGlucoseLevel, addInsulinLevel, calculateA1C} from './js/blood-glucose.js';

// Save to Session
// sessionStorage.setItem("key", value);
// Get from Session
// const varName = sessionStorage.getItem("key");

function handleFormSubmission() {
  const person = new User("name", "age", "dob");
  //To access person, do JSON.parse(sessionStorage.getItem(person))
  sessionStorage.setItem("person", JSON.stringify(person));
}

function handleGlucoseSubmission() {
  event.preventDefault();
  // Retrieve inputs
  const glucGoal = document.getElementById('glucose-goal').value;
  const glucLvl = document.getElementById('glucose-level').value;
  const glucLvlTime = document.getElementById('glucose-time').value;
  const insLvl = document.getElementById('insulin-level').value;
  const insLvlTime = document.getElementById('insulin-time').value;
  console.log(glucGoal);
  console.log(glucLvl);
  console.log(glucLvlTime);
  console.log(insLvl);
  console.log(insLvlTime);
  // Run functions to add data to user object
  updateGlucoseGoal(glucGoal);
  addGlucoseLevel(glucLvl, glucLvlTime);
  addInsulinLevel(insLvl, insLvlTime);
  calculateA1C();
  printGlucoseData();
  testPrintGlucTables()
  printInsulinData();
}

function dataToTable(array1Name, array1, array2Name, array2 ) {
  // Add data to table
  let table = document.createElement('table');
  table.setAttribute('class', 'table');
  // Build table header
  let head = document.createElement('thead');
  let headerRow = document.createElement('tr');
  let tableHeader1 = document.createElement('th');
  let tableHeader2 = document.createElement('th');
  tableHeader1.innerText = array1Name;
  tableHeader2.innerText = array2Name;
  headerRow.append(tableHeader1, tableHeader2);
  head.append(headerRow);
  table.append(head);
  // Build table body
  let body = document.createElement('tbody');
  for (let i = 0; i < array1.length; i++) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.innerText = array1[i];
    td2.innerText = array2[i];
    tr.append(td1, td2);
    body.append(tr);
  }
  table.append(body);
  return table;
}

function testPrintGlucTables() {
  let user = JSON.parse(sessionStorage.getItem('person'));
  // Make new div for data if not already made
  if (!document.querySelector('div#glucDiv')) {
    let glucDiv = document.createElement('div');
    glucDiv.setAttribute('id', 'glucDiv');
    document.querySelector('div.container').append(glucDiv);
  } else {
    document.querySelector('div#glucDiv').replaceChildren("");
  }
  const table = dataToTable('Glucose Levels', user.glucoseLevels, 'Glucose Time', user.glucoseTimes);
  document.querySelector('div#glucDiv').append(table);
}

function printGlucoseData() {
  let user = JSON.parse(sessionStorage.getItem('person'));
  // Make new div for data if not already made
  if (!document.querySelector('div#glucDiv')) {
    let glucDiv = document.createElement('div');
    glucDiv.setAttribute('id', 'glucDiv');
    document.querySelector('div.container').append(glucDiv);
  } else {
    document.querySelector('div#glucDiv').replaceChildren("");
  }
  // Add data to table
  let table = document.createElement('table');
  table.setAttribute('class', 'table');
  // Build table header
  let head = document.createElement('thead');
  let headerRow = document.createElement('tr');
  let tableHeader1 = document.createElement('th');
  let tableHeader2 = document.createElement('th');
  tableHeader1.innerText = 'Gluocose Levels';
  tableHeader2.innerText = 'Time';
  headerRow.append(tableHeader1, tableHeader2);
  head.append(headerRow);
  table.append(head);
  // Build table body
  let body = document.createElement('tbody');
  for (let i = 0; i < user.glucoseLevels.length; i++) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.innerText = user.glucoseLevels[i];
    td2.innerText = user.glucoseTimes[i];
    // li.append(`Glucose level is ${user.glucoseLevels[i]}, and time of the entry is ${user.glucoseTimes[i]}`);
    tr.append(td1, td2);
    body.append(tr);
  }
  table.append(body);
  // document.querySelector('div#glucDiv').append(table);
}

function printInsulinData() {
  let user = JSON.parse(sessionStorage.getItem('person'));
  if (!document.querySelector('div#insDiv')) {
    let insDiv = document.createElement('div');
    insDiv.setAttribute('id', 'insDiv');
    document.querySelector('div.container').append(insDiv);
  } else {
    document.querySelector('div#insDiv').replaceChildren('');
  }
  // Table functionality
  let table = document.createElement('table');
  table.setAttribute('class', 'table');
  let head = document.createElement('thead');
  let headerRow = document.createElement('tr');
  let tableHeader1 = document.createElement('th');
  let tableHeader2 = document.createElement('th');
  tableHeader1.innerText = 'Insulin Levels';
  tableHeader2.innerText = 'Time';
  headerRow.append(tableHeader1, tableHeader2);
  head.append(headerRow);
  table.append(head);
  let body = document.createElement('tbody');
  for (let i = 0; i < user.insulinLevels.length; i++) {
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    td1.innerText = user.insulinLevels[i]; 
    td2.innerText = user.insulinTimes[i]; 
    tr.append(td1, td2);
    body.append(tr);
  }
  table.append(body);
  document.querySelector('div#insDiv').append(table);
}



window.addEventListener('load', function () {
//console.log(`${process.env.API_KEY}`);
  handleFormSubmission();
  document.querySelector('form#glucose-form').addEventListener('submit', handleGlucoseSubmission);
});