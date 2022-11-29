import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';
import CarbService from './carb-services.js';
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
    printElements(carbsData);
  }, function(error) {
    printError(error);
  });
}

function printElements(data) {
  document.getElementById('carbs').innerText = `There are ${data.parsed[0].food.nutrients.CHOCDF} carbs in 100g of ${data.text}`
  console.log(data.parsed[0].food.nutrients.CHOCDF);
}

function printError() {
  document.getElementById('carbs').innerText = "somethings wrong"
}

function handleCarbSubmission(event) {
  event.preventDefault();
  const food = document.getElementById("type-of-food").value;
  console.log(food);
  getCarbs(food);
}

window.addEventListener("load", function() {
  document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);
})