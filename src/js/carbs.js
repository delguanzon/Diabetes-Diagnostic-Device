
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

export function addCarbs (gramsWeight, carbs, user) {
  const totalCarbs = gramsWeight * carbs;
  //let user = JSON.parse(sessionStorage.getItem('person'));
  let carbCount =  parseFloat(user.dailyCarbs) + parseFloat(totalCarbs); 
  user.dailyCarbs = parseFloat(carbCount.toFixed(2));
  //sessionStorage.setItem('person', JSON.stringify(user));
  return totalCarbs;
}

export function addMealCarbs (mealCarbs, user) {
  //let user = JSON.parse(sessionStorage.getItem('person'));
  let carbCount =  parseFloat(user.dailyCarbs) + parseInt(mealCarbs); 
  user.dailyCarbs = parseInt(carbCount.toFixed(2));
  //sessionStorage.setItem('person', JSON.stringify(user));
}


