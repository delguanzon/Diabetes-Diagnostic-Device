export default class User {

  constructor(name, age, dob, low, high) {
    this.name = name;
    this.age = age;
    this.dob = dob;
    this.activities = [];
    this.glucoseLevels = [low, high];
    this.glucoseTimes = [];
    this.insulinLevels = [];
    this.insulinTimes = [];
  }

  setBloodSugar(bs) {
    this.bs = bs;
  }

  addActivity(activity) {
    this.activities.push(activity);
  }

}

