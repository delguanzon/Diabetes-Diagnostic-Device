// * Carb Tracker 
// * User set limit, displays message if surpassed
// * Carbs/day 
//   * Basic user input
//   * User selects foods from recipes API list they've had that day, assembles meals / multiple meals / API gets nutritional info & stores total carb levels
// * Search diabetes-friendly recipes


// import CarbService from './carb-services.'

// function getCarbs(food) {
//   let promise = CarbService.getCarbs(food);
//   promise.then(function (carbsData) {

//     sessionStorage.setItem(food, JSON.stringify(promise));
//     printElements(carbsData);
//   }, function(error) {
//     printError(error);
//   });
// }

// function printElements(data) {
//   document.getElementById('carbs').innerText = `There are ${data.parsed[0].food.nutrients.CHOCDF} carbs in 100g of ${data.text}`
//   console.log(data.parsed[0].food.nutrients.CHOCDF);
// }

// function handleCarbSubmission(event) {
//   event.preventDefault();
//   const food = document.getElementById("type-of-food").value;
//   console.log(food);
//   getCarbs(food);
// }

// window.addEventListener("load", function() {
//   document.getElementById("food-carbs").addEventListener("submit", handleCarbSubmission);
// })