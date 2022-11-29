export default class User {

  constructor(name, age, dob) {
    this.name = name;
    this.age = age;
    this.dob = dob;
    this.glucoseLevels = [];
    this.glucoseTimes = [];
    this.insulinLevels = [];
    this.insulinTimes = [];
  }

  setBloodSugar(bs){
    this.bs = bs;
  }
}