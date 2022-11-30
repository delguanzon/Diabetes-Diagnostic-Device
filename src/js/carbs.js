
export function conversion (quantity, measurement) {
  if(measurement === 'grams') {
    return quantity/100;
  } else if(measurement === 'ounces') {
    return ((quantity/4) *100) / 100;
  } else if(measurement === 'pounds') {
    return ((quantity/.25) *100) / 100;       
  } else if(measurement === 'cups') {
    return ((quantity/.5) *100) / 100;    
  } else if(measurement === 'tablespoons') {
    return ((quantity/8) *100) / 100;    
  } else if(measurement === 'teaspoons') {
    return ((quantity/24) * 100) / 100;    
  }
} 

export function addCarbs (gramsWeight, carbs) {
  const totalCarbs = gramsWeight * carbs;
  let user = JSON.parse(sessionStorage.getItem('person'));
  let carbCount =  parseFloat(user.dailyCarbs) + totalCarbs; 
  user.dailyCarbs = carbCount.toFixed(2);
  // console.log(user.dailyCarbs);
  //To access person, do JSON.parse(sessionStorage.getItem(person))

  sessionStorage.setItem('person', JSON.stringify(user));
  //sessionStorage.setItem('totalCarbs', carbCount);
  console.log(carbCount);
  return totalCarbs;
}

export function addMealCarbs (mealCarbs) {
  let user = JSON.parse(sessionStorage.getItem('person'));
  let carbCount =  parseFloat(user.dailyCarbs) + parseInt(mealCarbs); 
  console.log(mealCarbs)
  user.dailyCarbs = carbCount.toFixed(2);
  sessionStorage.setItem('person', JSON.stringify(user));
}

// let carbCount = parseFloat(sessionStorage.getItem('totalCarbs')) + totalCarbs; 

