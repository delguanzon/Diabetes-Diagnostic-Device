import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';
import { Activity } from './js/activity.js';
import User from './js/user.js';

// Save to Session
// sessionStorage.setItem("key", value);
// Get from Session
// const varName = sessionStorage.getItem("key");

// function handleFormSubmission() {
//   const person = new User("name", "age", "dob");
//   //To access person, do JSON.parse(sessionStorage.getItem(person))
//   sessionStorage.setItem("person", JSON.stringify(person));
// }

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
  e.preventDefault();
  //new code to do checkBloodSugar
  const bloodSugar = document.getElementById("beforeBs").value;
  if (checkBloodSugar(bloodSugar) === "low") {
    document.getElementById("warning-tag-low").removeAttribute("hidden");
    document.getElementById("warning-msg-low").removeAttribute("hidden");
  } else if (checkBloodSugar(bloodSugar) === "high") {
    document.getElementById("warning-tag-high").removeAttribute("hidden");
    document.getElementById("warning-msg-high").removeAttribute("hidden");
  }
  document.getElementById("timer").removeAttribute("hidden");
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
  let s = sessionStorage.sec;
  let m = sessionStorage.min;
  let h = sessionStorage.hour;
  s++;
  if (s == 60) {
    s = 0;
    m++;
    if (m == 60) {
      m = 0;
      h++;
    }
  }
  document.getElementById("dispTimer").replaceChildren(`${h}:${m}:${s}`); //Fix timer formatting
  sessionStorage.sec = s;
  sessionStorage.min = m;
  sessionStorage.hour = h;
}


function handleEndTimer() {
  clearInterval(parseInt(sessionStorage.intId));
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
});