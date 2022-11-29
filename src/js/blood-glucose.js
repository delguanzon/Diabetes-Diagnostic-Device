export function updateGlucoseGoal(bloodGGoal) {
  let user = JSON.parse(sessionStorage.getItem('person'));
  user.gluceseGoal = bloodGGoal;
  sessionStorage.setItem('person', JSON.stringify(user));
  // Store number & time of day in User object session storage
}

export function addGlucoseLevel(bloodGLevel, dateTime) {
  let user = JSON.parse(sessionStorage.getItem('person'));
  user.glucoseLevels.push(bloodGLevel);
  user.glucoseTimes.push(dateTime);
  sessionStorage.setItem('person', JSON.stringify(user));

  console.log(bloodGLevel);
  console.log(dateTime);
  // Store number & time of day in User object session storage
}

export function addInsulinLevel(bloodILevel, dateTime) {
  let user = JSON.parse(sessionStorage.getItem('person'));
  user.insulinLevels.push(bloodILevel);
  user.insulinTimes.push(dateTime);
  sessionStorage.setItem('person', JSON.stringify(user));
  console.log(bloodILevel);
  console.log(dateTime);
  // Store number & time of day in User object session storage
}

export function calculateA1C() {
  // Get blood glucose level array
  let user = JSON.parse(sessionStorage.getItem('person'));
  let glucLvls = user.glucoseLevels;
  // Average bgl array
  let total = 0;
  glucLvls.forEach((element, index) => {
    const gLvl = parseInt(element);
    console.log(index, element);
    total += gLvl;
    console.log(total);
  });
  let avg = total / (glucLvls.length);
  console.log(avg);
  // Calc A1C
  let a1C = (avg + 46.7) / 28.7;
  console.log(a1C);
  // Add A1C to user obj
  user.a1C = a1C.toFixed(2);
  // Store in user object session storage
  sessionStorage.setItem('person', JSON.stringify(user));
}