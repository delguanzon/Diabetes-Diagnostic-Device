export function updateGlucoseGoal(low, high) {
  // "Checkout" User object from session storage
  let user = JSON.parse(sessionStorage.getItem('person'));
  // Add new keys to User object to store gluc range levels
  user.glucoseRangeLow = low;
  user.glucoseRangeHigh = high;
  // Store in User object in session storage
  sessionStorage.setItem('person', JSON.stringify(user));
}

export function addGlucoseLevel(bloodGLevel, dateTime) {
  let user = JSON.parse(sessionStorage.getItem('person'));
  user.glucoseLevels.push(bloodGLevel);
  user.glucoseTimes.push(dateTime);
  sessionStorage.setItem('person', JSON.stringify(user));
  // Store number & time of day in User object session storage
}

export function addInsulinLevel(bloodILevel, dateTime) {
  let user = JSON.parse(sessionStorage.getItem('person'));
  user.insulinLevels.push(bloodILevel);
  user.insulinTimes.push(dateTime);
  sessionStorage.setItem('person', JSON.stringify(user));
  // Store number & time of day in User object session storage
}

export function calculateA1C() {
  // Get blood glucose level array
  let user = JSON.parse(sessionStorage.getItem('person'));
  let glucLvls = user.glucoseLevels;
  // Average bgl array
  let total = 0;
  glucLvls.forEach((element) => {
    const gLvl = parseInt(element);
    total += gLvl;
  });
  let avg = total / (glucLvls.length);
  // Calc A1C
  let a1C = (avg + 46.7) / 28.7;
  // Add A1C to user obj
  user.a1C = a1C.toFixed(2);
  // Store in user object session storage
  sessionStorage.setItem('person', JSON.stringify(user));
}

// bloodGlucoseChecke -> Using latest gluc input
  // If gluc level above OR below range, return red alert
  // Else if gluc level within 10% of top or bottom of range, return yellow warning
  // Else, return green success