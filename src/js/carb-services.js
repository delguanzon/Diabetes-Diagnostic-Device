export default class CarbService {
  static getCarbs(food) {
    return new Promise(function (resolve, reject) {
      let request = new XMLHttpRequest();
      const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=68299e3f&app_key=${process.env.API_KEY}&ingr=${food}&nutrition-type=cooking`;
      request.addEventListener("loadend", function () {
        const response = JSON.parse(this.responseText);
        if (this.status === 200) {
          resolve([response, food]);
        } else {
          reject([this, response, food]);
        }
      });
      request.open("GET", url, true);
      request.send();
    });
  }
}

