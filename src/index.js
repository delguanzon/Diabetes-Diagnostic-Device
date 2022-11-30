import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';

import { Activity } from './js/activity.js';
import CarbService from './js/carb-services.js';
import { conversion, addCarbs } from './js/carbs.js';
import User from './js/user.js';
import { updateGlucoseGoal, addGlucoseLevel, addInsulinLevel, calculateA1C } from './js/blood-glucose.js';

async function getCarbs(food, user) {
  const promise = await CarbService.getCarbs(food);
  if (promise[0].text) {
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

//Utility Function
function checkBloodSugar(bloodSugar) {
  if (parseInt(bloodSugar) <= 100) {
    return "low";
  }
  else if (parseInt(bloodSugar) >= 200) {
    return "high";
  }
}


function resetActivity() {
  document.getElementById("beforeBs").value = "";
  document.getElementById("afterBs").value = "";
  document.getElementById("steps").value = "";
  document.getElementById("pause").setAttribute("disabled", "");
  document.getElementById("start").removeAttribute("disabled");
  document.getElementById("end").removeAttribute("disabled");
  document.getElementById("steps").value = "";
  document.getElementById("dispTimer").replaceChildren(`00:00:00`);

}
//Activity UI Logic

function handleNewActivity() {
  document.getElementById("new-activity").removeAttribute("hidden");
  document.getElementById("activity-form").removeAttribute("hidden");
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



  document.getElementById("warning-tag-high").setAttribute("hidden", "");
  document.getElementById("warning-msg-high").setAttribute("hidden", "");
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
  document.getElementById("timer").removeAttribute("hidden");
  sessionStorage.sec = 0;
  sessionStorage.min = 0;
  sessionStorage.hour = 0;
}

function handleStartTimer() {
  const bloodSugar = document.getElementById("beforeBs").value;
  let intId = parseInt(sessionStorage.intId);

  
  if (intId != null) {
    clearInterval(intId);
  }
  intId = setInterval(displayTimer, 1000);
  sessionStorage.intId = intId;
  //re-hide warning messages and activity form
  document.getElementById("activity-form").setAttribute("hidden", "");
  document.getElementById("pause").removeAttribute("disabled");
  document.getElementById("start").setAttribute("disabled", "");
  const activity = new Activity(bloodSugar, Date.now());
  console.log(activity);
  sessionStorage.setItem("activity", JSON.stringify(activity));
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
  let activity = JSON.parse(sessionStorage.activity);
  activity.timeEnd = Date.now();
  sessionStorage.setItem("activity", JSON.stringify(activity));

}

function handlePauseTimer() {
  clearInterval(parseInt(sessionStorage.intId));
  document.getElementById("pause").setAttribute("disabled", "");
  document.getElementById("start").removeAttribute("disabled");
  

}

function handleEndActivityForm(e) {
  e.preventDefault();
  let activity = JSON.parse(sessionStorage.activity);

  activity.steps = document.getElementById("steps").value;
  activity.currentBs = document.getElementById("afterBs").value; 

  console.log(activity);

  let person = JSON.parse(sessionStorage.person);
  person.activities.push(activity);
  sessionStorage.setItem("person", JSON.stringify(person));
  displayActivity();

  document.getElementById("new-activity-btn").removeAttribute("hidden");
  document.getElementById("end-activity-form").setAttribute("hidden", "");
  document.getElementById("timer").setAttribute("hidden", "");
  document.getElementById("activity-form").setAttribute("hidden", "");
  resetActivity();
}

function displayActivity() {
  const log = document.getElementById("activity-log");
  const person = JSON.parse(sessionStorage.getItem("person"));
  console.log(person);
  person.activities.forEach((activity) => {
    const act = new Activity(activity.beforeBs, activity.timeStart);
    act.setTimeEnd(activity.timeEnd);
    act.setSteps(activity.steps);
    console.log(act);
    log.replaceChildren(`Steps: ${activity.steps} Elapse Time: ${act.getElapseTime()} Date:  ${act.getActivityDate()}`);
  });
}

//temp
function displayTempActivity() {
  const person = JSON.parse(sessionStorage.getItem("person"));
  let displayDiv = document.getElementById("report-temp");

  for (const activity of person.activities) {
    let p = document.createElement("p");
    for (const [key, value] of Object.entries(activity)) {
      // add IF key vs condition 3000 steps, ~20min workout good, bad, great etc.
      p.append(`${
        key
      }: ${value}`);
    }
    displayDiv.append(p);
  }
}

window.addEventListener('load', function () {

  const person = new User("name", "age", "dob");
  sessionStorage.intId = null;
  //To access person, do JSON.parse(sessionStorage.getItem(person))
  sessionStorage.setItem("person", JSON.stringify(person));
  document.getElementById("new-activity-btn").addEventListener("click", handleNewActivity);
  document.getElementById("activity-form").addEventListener("submit", handleActivityFormSubmission);
  document.getElementById("start").addEventListener("click", handleStartTimer);
  document.getElementById("end").addEventListener("click", handleEndTimer);
  document.getElementById("pause").addEventListener("click", handlePauseTimer);
  document.getElementById("end-activity-form").addEventListener("submit", handleEndActivityForm);
  document.querySelector('form#glucose-form').addEventListener('submit', handleGlucoseSubmission);
  sessionStorage.setItem('totalCarbs', 0);
  document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);
  // temp
  document.getElementById("report-btn").addEventListener("click", displayTempActivity);
});