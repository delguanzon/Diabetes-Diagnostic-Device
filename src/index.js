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
  printInsulinData();
}

function printGlucoseData() {
  let user = JSON.parse(sessionStorage.getItem('person'));
  let displayContainer = document.querySelector('div.container');
  for (let i = 0; i < user.glucoseLevels.length; i++) {
    let p = document.createElement('p');
    p.append(`Glucose level is ${user.glucoseLevels[i]}, and time of the entry is ${user.glucoseTimes[i]}`);
    displayContainer.append(p);
  }
}

function printInsulinData() {
  let user = JSON.parse(sessionStorage.getItem('person'));
  let displayContainer = document.querySelector('div.container');
  for (let i = 0; i < user.insulinLevels.length; i++) {
    let p = document.createElement('p');
    p.append(`Insulin level is ${user.insulinLevels[i]}, and the time of the entry is ${user.insulinTimes[i]}`);
    displayContainer.append(p);
  }
}



window.addEventListener('load', function () {
//console.log(`${process.env.API_KEY}`);
  handleFormSubmission();
  document.querySelector('form#glucose-form').addEventListener('submit', handleGlucoseSubmission);
});