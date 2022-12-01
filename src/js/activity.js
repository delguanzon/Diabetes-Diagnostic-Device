export class Activity {

  constructor(beforeBs, timeStart) {
    this.beforeBs = beforeBs;
    this.timeStart = timeStart;
  }

  setAfterBloodSugar(bloodSugar) {
    this.afterBs = bloodSugar;
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
    let start = new Date(this.timeStart);
    let end = new Date(this.timeEnd);
    return (end.getTime() - start.getTime()) / 1000;
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