export default class User {

  constructor(name, age, dob) {
    this.name = name;
    this.age = age;
    this.dob = dob;
    this.dailyCarbs = 0;
  }

  setBloodSugar(bs){
    this.bs = bs;
  }
}