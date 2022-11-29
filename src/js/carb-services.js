export class CarbService {
  static getCarbs(food) {
    return new Promise(function(resolve, reject) {
      let request = new XMLHttpRequest();
      const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=68299e3f&app_key=${process.env.API_KEY}&ingr=${food}&nutrition-type=cooking`;
      //const url = `https://api.edamam.com/api/food-database/v2/parser?app_id=68299e3f&app_key=6cbe6726976017ffbf1f3a91bb0c9c51&ingr=asparagus&nutrition-type=cooking`;
      request.addEventListener("loadend", function() {
        const response = JSON.parse(this.responseText);
        console.log("here");
        if (this.status === 200) {
          resolve ([response, food]);
        } else {
          reject([this, response, food]);
        }
      });
      request.open("GET", url, true);
      request.send();
    });
  }
}