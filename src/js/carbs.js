
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

export function addCarbs (user, gramsWeight, carbs) {
  const totalCarbs = gramsWeight * carbs;
  let carbCount = parseFloat(sessionStorage.getItem('totalCarbs')) + totalCarbs; 
  sessionStorage.setItem('totalCarbs', carbCount);
  console.log(carbCount);
  return totalCarbs;
}


/// 8 T = 100 g        (input/8) * 100 = grams
// 24 t = 100 g       (input/24) * 100 = grams
// 4 ounces = 100 g   (input/4) * 100 = grams
// .25 lbs = 100 g    (input/.25) * 100 = grams
// .5 c = 100 g       (input/.5) * 100 = grams