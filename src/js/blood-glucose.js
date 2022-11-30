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

// bloodGlucoseChecker -> Using latest gluc input
export function bloodGlucoseChecker() {
  // "Check out" user obj
  let user = JSON.parse(sessionStorage.getItem('person'));
  const bottom = parseInt(user.glucoseRangeLow);
  const top = parseInt(user.glucoseRangeHigh);
  const glucLevelArray = user.glucoseLevels;
  const glucLatestLevel = parseInt(glucLevelArray[glucLevelArray.length - 1]);
  // If gluc level above OR below range, return red alert
  if (glucLatestLevel > top || glucLatestLevel < bottom) {
    user.glucStatus = 'redAlert';
  } else if (glucLatestLevel >= (top - 10)|| glucLatestLevel <= (bottom + 10)) {
    // Else if gluc level within 10 units of top or bottom of range, return yellow warning
    user.glucStatus = 'yellowWarning';
  } else {
    // Else, return green success
    user.glucStatus = 'greenSuccess';
  }
  // Store in user object session storage
  sessionStorage.setItem('person', JSON.stringify(user));
  // Return glucStatus
  return user.glucStatus;
}
