export function updateGlucoseGoal(bloodGGoal) {
  let user = JSON.parse(sessionStorage.getItem('person'));
  user.gluceseLevel = bloodGGoal;
  sessionStorage.setItem('person', JSON.stringify(user));
  // Store number & time of day in User object session storage
}

export function addGlucoseLevel(bloodGLevel, dateTime) {
  console.log(bloodGLevel);
  console.log(dateTime);
  // Store number & time of day in User object session storage
}

export function addInsulinLevel(bloodILevel, dateTime) {
  console.log(bloodILevel);
  console.log(dateTime);
  // Store number & time of day in User object session storage
}

export function calculateA1C(totalBloodGLevel) {
  console.log(totalBloodGLevel);
  // * A1C% = (Estimated average glucose(mg/dL) + 46.7) / 28.7 
  // Store in user object session storage
}

// Blood Glucose Monitor
  // * User set goal for glucose level
  // * Blood Glucose - User inputted number, five times / day or avg
    //   * store  inputted
    //   * (morning, breakfast, lunch, dinner, bedtime)
  // * Insulin Units/day - User inputted number based on what you eat / what your levels are
