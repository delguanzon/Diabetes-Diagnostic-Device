import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';
import CarbService from './js/carb-services.js';
import {conversion, getItemCarbs} from './js/carbs.js';
// import User from './js/user.js';

// Save to Session
// sessionStorage.setItem("key", value);
// Get from Session
// const varName = sessionStorage.getItem("key");

// function handleFormSubmission() {
//   const person = new User("name", "age", "dob");
//   //To access person, do JSON.parse(sessionStorage.getItem(person))
//   sessionStorage.setItem("person", JSON.stringify(person));
// }

// window.addEventListener('load', function () {
// //console.log(`${process.env.API_KEY}`);
// });

function getCarbs(food) {
  let promise = CarbService.getCarbs(food);
  promise.then(function (carbsData) {
    sessionStorage.setItem(food, JSON.stringify(promise));
    console.log(sessionStorage);
    printElements(carbsData);
  }, function() {
    printError();
  });
}

function printElements(data) {
  const carbs = data[0].parsed[0].food.nutrients.CHOCDF;
  document.getElementById('carbs').innerText = `There are ${carbs}g carbs in 100g of ${data[0].text}`;
}

function printError() {
  document.getElementById('carbs').innerText = "somethings wrong";
}

function handleCarbSubmission(event) {
  event.preventDefault();
  const food = document.getElementById("type-of-food").value;
  fetch getCarbs(food);
  let quantity = document.getElementById("quantity-of-food").value;
  let measurement = document.getElementById("measurement").value;
  const gramsWeight = conversion(quantity, measurement);
  getItemCarbs(gramsWeight, food);
  document.getElementById("type-of-food").innerText = null;
}

window.addEventListener("load", function() {
  document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);
});