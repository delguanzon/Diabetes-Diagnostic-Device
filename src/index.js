import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';

import { Activity } from './js/activity.js';
import CarbService from './js/carb-services.js';
import { conversion, addCarbs, addMealCarbs } from './js/carbs.js';
import User from './js/user.js';
import {updateGlucoseGoal, addGlucoseLevel, addInsulinLevel, calculateA1C, bloodGlucoseChecker} from './js/blood-glucose.js';


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
  bloodGlucoseChecker();
  // Print results
  printGlucoseData();
  // Reset form
  resetInputElement(document.getElementById('glucose-level'));
}

function handleInsulinSubmission() {
  event.preventDefault();
  // Retrieve inputs
  const insLvl = document.getElementById('insulin-level').value;
  const insLvlTime = new Date();
  // Run functions to add data to user object
  addInsulinLevel(insLvl, insLvlTime);
  printInsulinData();
  // Reset form
  resetInputElement(document.getElementById('insulin-level'));
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
  let glucLevelsArray = user.glucoseLevels;
  for (let i = 0; i < user.glucoseTimes.length; i++) {
    glucTimeArray[i] = toTimeStamp(user.glucoseTimes[i]);
    glucLevelsArray[i] = glucLevelsArray[i] + ' mg/dL';
  }
  const table = dataToTable('Glucose Levels', glucLevelsArray, 'Time Logged', glucTimeArray);
  // Display alert based on logic (if red, else if yellow, else green)
  if (user.glucStatus){
    let alertContainer = document.createElement('div');
    alertContainer.setAttribute('role', 'alert');
    if (user.glucStatus === 'redAlert') {
      alertContainer.setAttribute('class', 'alert alert-danger');
      alertContainer.append('Alert! Current blood glucose level outside target range.');
    } else if (user.glucStatus === 'yellowWarning') {
      alertContainer.setAttribute('class', 'alert alert-warning');
      alertContainer.append('Warning! Current blood glucose level close to target limits.');
    } else if (user.glucStatus === 'greenSuccess') {
      alertContainer.setAttribute('class', 'alert alert-success');
      alertContainer.append('Success! Current blood glucose level within target range.');
    } 
    document.querySelector('div#glucDiv').prepend(alertContainer);
  }
  // Display Glucose Summary Header & A1C 
  let summaryTitle = `Glucose Levels`;
  let h3 = document.createElement("h3");
  h3.append(summaryTitle);
  let a1C = `A1C ${user.a1C}`;
  let h5 = document.createElement("h5");
  h5.append(a1C);
  document.querySelector('div#glucDiv').append(h3, h5);
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

  // Convert user.glucoseTimes array to array of printable timeStamps
  let insTimeArray = user.insulinTimes;
  for (let i = 0; i < user.insulinTimes.length; i++) {
    insTimeArray[i] = toTimeStamp(user.insulinTimes[i]);
  }
  const table = dataToTable('Insulin Level', user.insulinLevels, 'Time Logged', insTimeArray);
  document.querySelector('div#insDiv').append(table);
}

//Utility Function
function toTimeStamp(dateValue) { 
  // Convert date to hours:minutes
  let date = new Date(dateValue);
  let timeStamp = `${date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}`;
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

function updateProgressBar(steps, time) {

  
  const floatdiv = document.getElementById("floatdiv");
  const wProgressBar = document.getElementById("workout-progress");
  const wGoal = 1200;
  const wPercent = (time/wGoal)*100;
  console.log(`Total Time: ${time}`);
  wProgressBar.setAttribute("style", `width: ${wPercent}%`);
  wProgressBar.replaceChildren(`${wPercent}%`);

  const progressBar = document.getElementById("steps-progress");
  const goal = 3000;
  const percent = (steps/goal)*100;
  progressBar.setAttribute("style", `width: ${percent}%`);
  progressBar.replaceChildren(`${steps} out of 3000`);


  // find time of all logged activities, add, and check against fitnessGoal
  // totalTime and fitnessGoal are left in seconds
  let h4 = document.createElement("h4");
  h4.append("Progress Report:");
  
  if (time < (wGoal)) {
    floatdiv.append(`Heads Up! Your total workout time ${time} was short of your daily goal of 20 mins`);
  } else if (time >= (wGoal)) {
    floatdiv.append(`Your total workout time today has met or exceeded your daily goal of ${wGoal}! Keep up the good work!`);
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
  let person = JSON.parse(sessionStorage.person);
  person.glucoseLevels.push(bloodSugar);
  person.glucoseTimes.push(Date.now());
  sessionStorage.setItem("person", JSON.stringify(person));

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

  activity.timeEnd = Date.now();
  console.log(activity);

  let person = JSON.parse(sessionStorage.person);
  person.activities.push(activity);
  person.glucoseLevels.push(activity.currentBs);
  person.glucoseTimes.push(Date.now());
  sessionStorage.setItem("person", JSON.stringify(person));

  displayRecentActivity();

  document.getElementById("new-activity-btn").removeAttribute("hidden");
  document.getElementById("end-activity-form").setAttribute("hidden", "");
  document.getElementById("timer").setAttribute("hidden", "");
  document.getElementById("activity-form").setAttribute("hidden", "");
  resetActivity();
}

function displayRecentActivity() {
  const log = document.getElementById("recent-activity");
  const person = JSON.parse(sessionStorage.getItem("person"));
  let totalSteps = 0;
  let totalTime = 0;
  console.log(person);
  person.activities.forEach((activity) => {
    const act = new Activity(activity.beforeBs, activity.timeStart);
    act.setTimeEnd(activity.timeEnd);
    act.setSteps(activity.steps);
    console.log(act);
    let x = act.getElapseTime();
    let elapseTime = x > 60 ? Math.round(x / 60) + " min " + (x % 60).toFixed(2) + " sec" : x.toFixed() + " sec";

    log.replaceChildren(` Date: ${act.getActivityDate()} Steps: ${activity.steps} Elapse Time: ${elapseTime}`);
    totalSteps += parseInt(activity.steps);
    totalTime += parseInt(x); 
  });
  updateProgressBar(totalSteps, totalTime);
}

// logs activity data, adds activity data as a daily entry
function logActivity() {
  //document.querySelector(".floating-div").removeAttribute("hidden");
  const person = JSON.parse(sessionStorage.getItem("person"));
  let displayUl = document.createElement("ul");
  displayUl.setAttribute("id", "display-day-ul");

  // check day and assign dayID
  let day = new Date(Date.now());
  let dayID;
  switch(day.getDay())
  {
  case(0):
    dayID = "sunday-report";
    break;
  case(1):
    dayID = "monday-report";
    break;
  case(2):
    dayID = "tuesday-report";
    break;
  case(3):
    dayID = "wednesday-report";
    break;
  case(4):
    dayID = "thursday-report";
    break;
  case(5):
    dayID = "friday-report";
    break;
  case(6):
    dayID = "saturday-report";
    break;
  }
  
  for (const activity of person.activities) {
    let date = new Date(activity.timeStart);
    
    // Display time header for each log
    displayUl.append(`@ ${date.toTimeString()}`);
    for (const [key, value] of Object.entries(activity)) {
      let li = document.createElement("li");

      // find time of workout
      if (key === "timeStart") {
        let start = new Date(value);
        let end = new Date(activity.timeEnd);
        let time = (end.getTime() - start.getTime()) / 1000;
        if (time > 60 && time < 3600) {
          time = Math.round(time / 60).toString() + "min " + (time % 60).toFixed(2).toString() + "sec";
        } else if (time > 3600) {
          time = Math.round((time / 60) / 60).toString() + "hr " + ((time % 60) * 60).toString() + "min"
            + (((time % 60) * 60) % 60).toString() + "sec";
        }

        li.append(`time: ${time}`);
        displayUl.append(li);
        continue;
      } else if (key === "timeEnd") {
        continue;
      }

      li.append(`${key}: ${value}`);
      displayUl.append(li);
    }

    //append UL to dayID i.e. Monday
    document.getElementById(`${dayID}`).replaceChildren(displayUl);
  }

  //get goals and report total met
  let goalsMet = 0;

  //update as we add goals
  const goalsSet = 1;

  //append progress report details
  let progressTitle = document.createElement("h5");
  progressTitle.append(`progress report:`);
  displayUl.append(progressTitle);

  //get total steps from progress bar
  let stepsP = document.createElement("p");
  stepsP.append(`Steps Goal: ${(document.getElementById("steps-progress").innerText).split(' ')[0]} out of 3000 steps`);
  displayUl.append(stepsP);
  if (parseInt((document.getElementById("steps-progress").innerText).split(' ')[0]) >= 3000) {
    goalsMet += 1;
  }

  //get time goal
  let timeP = document.createElement("p");
  timeP.append(`Workout Time Goal: ${document.getElementById("workout-progress").innerText} of the way to 20 minutes`);
  displayUl.append(timeP);

  // goal set and met meter
  let goalsP = document.createElement("p");
  goalsP.append(`${person.name}, you met ${goalsMet} out of ${goalsSet}`);
  displayUl.append(goalsP);
}

function handleLandingForm(e) {
  e.preventDefault();
  let name = document.getElementById("fnField").value;
  let age = document.getElementById("ageField").value;
  let dob = document.getElementById("dobField").value;
  let low = document.getElementById("lowField").value;
  let high = document.getElementById("highField").value;

  const person = new User(name, age, dob, low, high);
  sessionStorage.intId = null;
  //To access person, do JSON.parse(sessionStorage.getItem(person))
  sessionStorage.setItem("person", JSON.stringify(person));

  document.getElementById("main-div").removeAttribute("hidden");
  document.getElementById("landing-div").setAttribute("hidden","");
}

window.addEventListener('load', function () {

  document.getElementById("new-activity-btn").addEventListener("click", handleNewActivity);
  document.getElementById("activity-form").addEventListener("submit", handleActivityFormSubmission);
  document.getElementById("end-activity-form").addEventListener("submit", handleEndActivityForm); 
  document.getElementById("start").addEventListener("click", handleStartTimer);
  document.getElementById("end").addEventListener("click", handleEndTimer);
  document.getElementById("pause").addEventListener("click", handlePauseTimer);
  document.querySelector('form#glucose-goal-form').addEventListener('submit', handleGlucoseGoalSubmission);
  document.querySelector('form#glucose-level-form').addEventListener('submit', handleGlucoseSubmission);
  document.querySelector('form#insulin-level-form').addEventListener('submit', handleInsulinSubmission);  
  document.getElementById("landingSubmit").addEventListener("click", handleLandingForm);
  document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);
  document.getElementById("meal-carbs-button").addEventListener("click", handleMealSubmission);
  document.getElementById("carb-goal-button").addEventListener("click", handleCarbGoalSubmission);  
  document.getElementById("report-btn").addEventListener("click", logActivity);

});