export default class User {

  constructor(name, age, dob) {
    this.name = name;
    this.age = age;
    this.dob = dob;
    this.glucoseLevels = [];
    this.glucoseTimes = [];
  }

  setBloodSugar(bs){
    this.bs = bs;
  }
}