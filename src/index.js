import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/styles.css';
import CarbService from './js/carb-services.js';
import {conversion} from './js/carbs.js';
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

async function getCarbs(food) {
  const promise = await CarbService.getCarbs(food);
  if(promise[0].text) {
    sessionStorage.setItem(food, JSON.stringify(promise));
    printElements(promise);
  } else {
    printError();
  }
}

// async function getWeather(city) {
//   const response = await WeatherService.getWeather(city);
//   if(response.main) {
//     printElements(response, city);
//   } else {
//     printError(response, city);
//   }
// }

function printElements(data) {
  const carbs = data[0].parsed[0].food.nutrients.CHOCDF;
  let quantity = document.getElementById("quantity-of-food").value;
  let measurement = document.getElementById("measurement").value;
  const gramsWeight = conversion(quantity, measurement);
  const totalCarbs = gramsWeight * carbs;
  document.getElementById('carbs').innerText = `There are ${totalCarbs}g carbs in ${quantity} ${measurement} of ${data[0].text}`;
}

function printError() {
  document.getElementById('carbs').innerText = "somethings wrong";
}

function handleCarbSubmission(event) {
  event.preventDefault();
  const food = document.getElementById("type-of-food").value;
  getCarbs(food);
  document.getElementById("type-of-food").innerText = null;
}

window.addEventListener("load", function() {
  document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);
});