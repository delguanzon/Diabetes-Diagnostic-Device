import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';

import { Activity } from './js/activity.js';
import CarbService from './js/carb-services.js';
import { conversion, addCarbs, addMealCarbs } from './js/carbs.js';
import User from './js/user.js';
import { updateGlucoseGoal, addGlucoseLevel, addInsulinLevel, calculateA1C } from './js/blood-glucose.js';

async function getCarbs(food) {
  const promise = await CarbService.getCarbs(food);
  if (promise[0].text) {
    sessionStorage.setItem(food, JSON.stringify(promise));
    carbsCalc(promise, food);
  } else {
    printError();
  }
}

function carbsCalc(data, food) {
  const carbs = data[0].parsed[0].food.nutrients.CHOCDF;
  let user = JSON.parse(sessionStorage.getItem('person'));
  let quantity = document.getElementById("quantity-of-food").value;
  let measurement = document.getElementById("measurement").value;
  const gramsWeight = conversion(quantity, measurement);
  let ingredientCarbs = addCarbs(gramsWeight, carbs, user).toFixed(2);
  console.log(ingredientCarbs);
  document.getElementById('carbs').innerText = `There are ${ingredientCarbs}g carbs in ${quantity} ${measurement} of ${data[0].text}`;
  user.food.push(food);
  user.foodCarbs.push(parseFloat(ingredientCarbs));
  user.foodTimes.push(Date.now());
  sessionStorage.setItem('person', JSON.stringify(user));
  printElements(user);
}

function printElements(user) {
  let goal = user.carbsGoal;
  // if (parseFloat(user.dailyCarbs) >= goal) {
  //   document.getElementById('carb-warning').innerText = 'You have reached your carb limit'
  // } else if (parseFloat(user.dailyCarbs) >= goal * .75) {
  //   document.getElementById('carb-warning').innerText = 'You have reached 75% of your carb limit'
  // } else if (parseFloat(user.dailyCarbs) >= goal * .5) {
  //   document.getElementById('carb-warning').innerText = 'You have reached 50% of your carb limit'
  // }
  document.getElementById("daily-carbs").innerText = `${user.dailyCarbs}g / ${goal}g`;

  let carbProgress = document.getElementById("carbBar");
  console.log(user.dailyCarbs/goal);
  if (user.dailyCarbs/goal < 1) { 
    carbProgress.style.width = ((user.dailyCarbs/goal)*100).toFixed(1) + '%';
    if (user.dailyCarbs/goal >= .1) {
      carbProgress.innerHTML = ((user.dailyCarbs/goal)*100).toFixed(1) + '%';
    }
    if (user.dailyCarbs/goal >= .7) {
      carbProgress.style.backgroundColor = 'yellow';
      carbProgress.style.color = 'black';
    }
  } else {
    carbProgress.style.width = 100 + '%';
    carbProgress.innerHTML = 'You have reached your carb limit';
    carbProgress.style.backgroundColor = 'red';
    carbProgress.style.color = 'white';
  }
  let ulElement = document.createElement("ul");
  for (let i = 0; i < user.food.length; i++) {
    let currentDate = new Date(user.foodTimes[i]);
    let currentHours = currentDate.getHours(); 
    let currentMinutes = String(currentDate.getMinutes()).padStart(2, "0");
    let month = currentDate.getMonth() + 1;
    let day = currentDate.getDate();
    let year = currentDate.getFullYear().toString().split('');
    let printLog = `${user.food[i]} ${'\xa0'.repeat(3)} ${user.foodCarbs[i]}g ${'\xa0'.repeat(3)} ${currentHours}:${currentMinutes} ${'\xa0'.repeat(3)} ${month}/${day}/${year[2]}${year[3]}`;
    let liElement = document.createElement('li')
    liElement.append(printLog);
    ulElement.append(liElement);
  }
  document.getElementById("carb-data-display").replaceChildren(ulElement);
}

function printError() {
  document.getElementById('carbs').innerText = "somethings wrong";
}

function handleCarbSubmission() {
  event.preventDefault();
  const food = document.getElementById("type-of-food").value;
  getCarbs(food);
  document.getElementById("type-of-food").innerText = null;
}

function handleMealSubmission() {
  event.preventDefault();
  let user = JSON.parse(sessionStorage.getItem('person'));
  const mealName = document.getElementById("meal-name").value;
  const mealCarbs = document.getElementById("meal-carbs").value;
  user.food.push(mealName);
  user.foodCarbs.push(parseFloat(mealCarbs));
  user.foodTimes.push(Date.now());
  addMealCarbs(mealCarbs, user);
  sessionStorage.setItem('person', JSON.stringify(user));
  printElements(user);
}

function handleCarbGoalSubmission() {
  let user = JSON.parse(sessionStorage.getItem('person'));
  let goal = document.getElementById('carb-goal').value;
  user.carbsGoal = goal;
  sessionStorage.setItem('person', JSON.stringify(user));
  document.getElementById('carb-inputs').removeAttribute("class");
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
  document.querySelector('form#glucose-form').addEventListener('submit', handleGlucoseSubmission);
  document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);
  document.getElementById("meal-carbs-button").addEventListener("click", handleMealSubmission);
  document.getElementById("carb-goal-button").addEventListener("click", handleCarbGoalSubmission);

});