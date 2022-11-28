#  Daily Diabetic Diagnostic Device

### By Yodel Guanzon, Richard Cha, Jennifer Holcomb, Kirsten Opstad, Dominik Magic, and Henry Sullivan

#### This is a tracking app for people with diabetes.

## Technologies Used

* Git
* HTML
* Javascript
* NodeJS
* ESLint
* JEST
* Babel
* Webpack
* Html Loader
* DotEnv
* Bootstrap
* Edamam API

## Description

A Health Management System for person with Diabetes that tracks information related to diabetes stats.

#### Objectives (MVP)

* Create a user profile to store user data locally
  * Features:

      * Blood Glucose Monitor
        * User set goal for glucose level
        * Blood Glucose - User inputted number, five times / day or avg
          * store number & time of day inputted
          * (morning, breakfast, lunch, dinner, bedtime)
        * Insulin Units/day - User inputted number based on what you eat / what your levels are
        * A1C% = (Estimated average glucose(mg/dL) + 46.7) / 28.7 

      * Carb Tracker 
        * User set limit, displays message if surpassed
        * Carbs/day 
          * Basic user input
          * User selects foods from recipes API list they've had that day, assembles meals / multiple meals / API gets nutritional info & stores total carb levels
        * Search diabetes-friendly recipes

      * Activity Tracker
        * User sets goal for daily exercise minutes
        * Activity - User inputs activity for the day
        
  * Site Structure:
  
    * **Index UI**
      * Form inputs:
        * Blood Glucose (single or multiple entries)
        * Carb Tracker (search, select & save by whole ingredients)
        * Activity Tracker (single or multiple entries)
      * User Snapshot Green / Yellow / Red Indicator 

#### Goals
1. Meet project MVP requirements.
2. Create multiple HTML pages (user profile, recipes etc.) 
3. Stretch: Generate dynamic Insulin Units reading based on user inputted meals  & carb ratio (ex. 1unit/5grams).
4. Stretch: Save favorite recipes to profile
5. Stretch: Interface with fitbit / wearable tracker API to get user activity data
6. Stretch: Recipe Search Section

## Setup/Installation Requirements

* Install Node.js:
* [OS X and Windows Instructions](https://www.learnhowtoprogram.com/intermediate-javascript/getting-started-with-javascript/installing-node-js)
* Clone this repository on your desktop
* Navigate to the top level of the directory using bash or cmd
* Run ``` $npm install ``` to install dependencies
* Confirm all files in the src folder have 0 errors by running command ``` $ npm run lint ```
* Confirm all business logic tests pass with Jest by running command ``` $ npm run test ```
* For building and live preview, use ```npm run start```

### API Key Setup

* Using your window explorer, Create a .env file in the top level of the directory .
* Edit the file and type in ``` API_KEY=YOUR+API+KEY+HERE ```  , where you replace the value with your own API Key.

OR 

* Using bash or the command line, Navigate to the top level of the directory and type the following command in your terminal:

  ```touch .env | echo "API_KEY=<YOUR+API+KEY+HERE>" >.env ```

  where <YOUR+API+KEY+HERE> should be replaced by the api key.

## Known Bugs

* None

Found a bug? Email us at <yodelguanzon@gmail.com>

## License

MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Copyright (c) 2022 Yodel Guanzon, Richard Cha, Jennifer Holcomb, Kirsten Opstad, Dominik Magic, and Henry Sullivan

