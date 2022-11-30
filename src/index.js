import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';

import { Activity } from './js/activity.js';
import CarbService from './js/carb-services.js';
import {conversion, addCarbs} from './js/carbs.js';
import User from './js/user.js';
import {updateGlucoseGoal, addGlucoseLevel, addInsulinLevel, calculateA1C} from './js/blood-glucose.js';

async function getCarbs(food, user) {
  const promise = await CarbService.getCarbs(food);
  if(promise[0].text) {
    sessionStorage.setItem(food, JSON.stringify(promise));
    printElements(promise, user);
  } else {
    printError();
  }
}

function printElements(data, user) {
  const carbs = data[0].parsed[0].food.nutrients.CHOCDF;
  let quantity = document.getElementById("quantity-of-food").value;
  let measurement = document.getElementById("measurement").value;
  const gramsWeight = conversion(quantity, measurement);
  let totalCarbs = addCarbs(user, gramsWeight, carbs);
  document.getElementById('carbs').innerText = `There are ${totalCarbs}g carbs in ${quantity} ${measurement} of ${data[0].text}`;
  document.getElementById("daily-carbs").innerText = sessionStorage.getItem('totalCarbs');
}

function printError() {
  document.getElementById('carbs').innerText = "somethings wrong";
}

function handleCarbSubmission() {
  event.preventDefault();
  let user = new User("Henry", "25", "8/30/1997");
  const food = document.getElementById("type-of-food").value;
  getCarbs(food, user);
  document.getElementById("type-of-food").innerText = null;
}

function handleGlucoseGoalSubmission() {
  event.preventDefault();
  // Retrieve inputs
  const glucRangeLow = document.getElementById('glucose-range-low').value;
  const glucRangeHigh = document.getElementById('glucose-range-high').value;
  // Run function to add data to user object
  updateGlucoseGoal(glucRangeLow, glucRangeHigh);
  // TODO: Add display function
  // Reset form
  resetInputElement(document.getElementById('glucose-range-low'));
  resetInputElement(document.getElementById('glucose-range-high'));
}

function handleGlucoseSubmission() {
  event.preventDefault();
  // Retrieve inputs
  const glucLvl = document.getElementById('glucose-level').value;
  const glucLvlTime = new Date();
  // Run functions to add data to user object
  addGlucoseLevel(glucLvl, glucLvlTime);
  calculateA1C();
  // Print results
  printGlucoseData();
  printA1CData();
  // Reset form
  resetInputElement(document.getElementById('glucose-level'));
  resetInputElement(document.getElementById('glucose-time'));
}

function handleInsulinSubmission() {
  event.preventDefault();
  // Retrieve inputs
  const insLvl = document.getElementById('insulin-level').value;
  const insLvlTime = document.getElementById('insulin-time').value;
  // Run functions to add data to user object
  addInsulinLevel(insLvl, insLvlTime);
  printInsulinData();
  // Reset form
  resetInputElement(document.getElementById('insulin-level'));
  resetInputElement(document.getElementById('insulin-time'));
}

function dataToTable(array1Name, array1, array2Name, array2) {
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
  // Convert user.glucoseTimes array to array of printable timeStamps
  let glucTimeArray = user.glucoseTimes;
  for (let i = 0; i < user.glucoseTimes.length; i++) {
    glucTimeArray[i] = toTimeStamp(user.glucoseTimes[i]);
  }
  const table = dataToTable('Glucose Levels', user.glucoseLevels, 'Time Logged', glucTimeArray);
  document.querySelector('div#glucDiv').append(table);
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
  const table = dataToTable('Insulin Level', user.insulinLevels, 'Time Logged', user.insulinTimes);
  document.querySelector('div#insDiv').append(table);
}

function printA1CData() {
  let user = JSON.parse(sessionStorage.getItem('person'));
  if (!document.querySelector('div#a1c')) {
    let a1c = document.createElement('div');
    a1c.setAttribute('id', 'a1c');
    document.querySelector('div.container').append(a1c);
  } else {
    document.querySelector('div#a1c').replaceChildren('');
  }
  document.querySelector('div#a1c').innerText = user.a1C;
}

//Utility Function
function toTimeStamp(dateValue) { 
  // Convert date to hours:minutes
  let date = new Date(dateValue);
  let timeStamp = `${date.getHours()}:${date.getMinutes()}`;
  return timeStamp;
}

function resetInputElement(docElement) {
  docElement.value = null;
}

function checkBloodSugar(bloodSugar) {
  if (parseInt(bloodSugar) <= 100) {
    return "low";
  }
  else if (parseInt(bloodSugar) >= 200) {
    return "high";
  }
}

function handleNewActivity() {
  document.getElementById("new-activity").removeAttribute("hidden");
  document.getElementById("new-activity-btn").setAttribute("hidden", "");
}

function handleActivityFormSubmission(e) {

  let lowTag = document.getElementById("warning-tag-low");
  let lowMsg = document.getElementById("warning-msg-low");
  let highTag = document.getElementById("warning-tag-high");
  let highMsg = document.getElementById("warning-msg-high");


  lowMsg.setAttribute("hidden", "");
  lowTag.setAttribute("hidden", "");
  highTag.setAttribute("hidden", "");
  highMsg.setAttribute("hidden", "");



  document.getElementById("warning-tag-high").setAttribute("hidden","");
  document.getElementById("warning-msg-high").setAttribute("hidden","");
  e.preventDefault();
  //new code to do checkBloodSugar
  const bloodSugar = document.getElementById("beforeBs").value;
  if (checkBloodSugar(bloodSugar) === "low") {
    lowTag.removeAttribute("hidden");
    lowMsg.removeAttribute("hidden");
  } else if (checkBloodSugar(bloodSugar) === "high") {
    highTag.removeAttribute("hidden");
    highMsg.removeAttribute("hidden");
  }
  else document.getElementById("timer").removeAttribute("hidden");
}

function handleStartTimer() {
  const bloodSugar = document.getElementById("beforeBs").value;
  const activity = new Activity(bloodSugar, Date.now());
  let intId = parseInt(sessionStorage.intId);
  sessionStorage.sec = 0;
  sessionStorage.min = 0;
  sessionStorage.hour = 0;

  if (intId != null) {
    clearInterval(intId);
  }
  intId = setInterval(displayTimer, 1000);
  sessionStorage.intId = intId;
  sessionStorage.setItem("activity", JSON.stringify(activity));
  //re-hide warning messages and activity form
  document.getElementById("activity-form").setAttribute("hidden", "");
}

function displayTimer() {
  let sec = sessionStorage.sec;
  let min = sessionStorage.min;
  let hour = sessionStorage.hour;
  sec++;
  if (sec == 60) {
    sec = 0;
    min++;
    if (min == 60) {
      min = 0;
      hour++;
    }
  }

  let h = hour < 10 ? "0" + hour : hour;
  let m = min < 10 ? "0" + min : min;
  let s = sec < 10 ? "0" + sec : sec;
  document.getElementById("dispTimer").replaceChildren(`${h}:${m}:${s}`); //Fix timer formatting
  sessionStorage.sec = sec;
  sessionStorage.min = min;
  sessionStorage.hour = hour;
}


function handleEndTimer() {
  clearInterval(parseInt(sessionStorage.intId));
  document.getElementById("end-activity-form").removeAttribute("hidden");
  
}

function handleEndActivityForm(e) {
  //TODO: hide Timer, reveal this form
  e.preventDefault();
  let activity = JSON.parse(sessionStorage.activity);
  
  activity.steps = document.getElementById("steps").value;
  activity.currentBs = document.getElementById("afterBs").value;
  activity.timeEnd = Date.now();
  
  console.log(activity);
  sessionStorage.activity = activity;

  let person = JSON.parse(sessionStorage.person);
  person.activities.push(activity);
  sessionStorage.setItem("person", JSON.stringify(person));
  
}

window.addEventListener('load', function () {

  const person = new User("name", "age", "dob");
  sessionStorage.intId = null;
  //To access person, do JSON.parse(sessionStorage.getItem(person))
  sessionStorage.setItem("person", JSON.stringify(person));
  document.getElementById("new-activity-btn").addEventListener("click", handleNewActivity);
  document.getElementById("activity-form").addEventListener("submit", handleActivityFormSubmission);
  this.document.getElementById("start").addEventListener("click", handleStartTimer);
  this.document.getElementById("end").addEventListener("click", handleEndTimer);
  document.getElementById("end-activity-form").addEventListener("submit", handleEndActivityForm); 
  document.querySelector('form#glucose-goal-form').addEventListener('submit', handleGlucoseGoalSubmission);
  document.querySelector('form#glucose-level-form').addEventListener('submit', handleGlucoseSubmission);
  document.querySelector('form#insulin-level-form').addEventListener('submit', handleInsulinSubmission);  
  sessionStorage.setItem('totalCarbs', 0);
  document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);

});