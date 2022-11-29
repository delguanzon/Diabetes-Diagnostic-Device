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
});