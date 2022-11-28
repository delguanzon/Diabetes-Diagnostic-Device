export class CarbService {
  static getCarbs(food, amount) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = ;
      request.addEventListener("loadend", function() {
        const response = JSON.parse(this.responseText);
        if (this.status === 200) {
          resolve ([response, food, amount]);
        } else {
          reject([this, response, food, amount]);
        }
      });
      request.open("GET", url, true);
      request.send();
    });
  }
}