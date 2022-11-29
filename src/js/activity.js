export class Activity {

  constructor(beforeBs, timeStart ) {    
    this.timeStart = timeStart;
    this.beforeBs = beforeBs;
  }

  setAfterBloodSugar(bloodSugar) {
    this.afterBs = bloodSugar;
  }

  checkBloodSugar(bloodSugar) {
    // UI: IF bloodSugar < 100 add a warning:
    // "If your blood sugar level is less than 100 mg/dl before you start your activity, try having a small 
    // carbohydrate snack (about 15 grams) to increase your blood sugar and reduce your risk for hypoglycemia."
    // ELSE IF bloodSugar > 180 add a warning:
    // If your blood sugar is high before starting exercise, check your blood or 
    // urine for ketones. If you test positive for ketones, avoid vigorous activity.

    if(bloodSugar <= 100) {
      return "yellow";
    }
    else if (bloodSugar >= 180 && bloodSugar < 200) {
      return "orange";
    }
    else if (bloodSugar >= 200 ) {
      return "red";
    }
  }

  setSteps(steps) {
    this.steps = steps;
    // UI: steps === bad < 3000 < great
  }
  
  setTimeEnd(time) {
    this.timeEnd = time;
    // UI: timEnd === bad < 20min < great
  }

  getElapseTime() {
    return  (this.timeEnd - this.timeStart)/1000;
  }
  
  getActivityDate() {
    const todaysDate = new Date(this.timeStart);
    return `${todaysDate.getMonth() + 1}-${todaysDate.getDate()}-${todaysDate.getFullYear()}`;
  }
}

// user - > activity -> save profile
//             Timer
//             bloodSugar Levels
//             stop > bloodSugarLevels
//             steps
//             successValue