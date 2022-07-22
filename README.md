
# [Contra Costa Golf Club](https://ccgc.surge.sh/)
#### A full-stack web application deployed at [ccgc.surge.sh/](https://ccgc.surge.sh/)

![](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

[<img src="https://i.ibb.co/72nKCSf/ccgc-Logo11.png" width="200" height="250"/>](https://ccgc.surge.sh/)



[Front-End](https://github.com/MattPereira/ccgc-frontend) | 
[Back-End](https://github.com/MattPereira/ccgc-backend)


## Description
The site displays all of the [tournaments](https://ccgc.surge.sh/tournaments), [greenies](https://ccgc.surge.sh/greenies), [members](https://ccgc.surge.sh/members), [courses](https://ccgc.surge.sh/courses), and [standings](https://ccgc.surge.sh/standings) data for the 2021-22 season. Tournament data tables are sorted in ascending order to display the winners of each round. Additionally, all users are able to input their strokes, putts, and greenies for each round. Upon submission of any new, edited, or deleted data, tour points are automatically recalculated. 


## Features
**Full CRUD for all registered users**
  * Regular Users can create,update, and delete their round scores (strokes and putts and greenies) 
  * Admin users can additionally add new golf course data and create new tournaments

**Internal API**
  * deployed on heroku at [contra-costa-golf-club.herokuapp.com](https://contra-costa-golf-club.herokuapp.com/)
  * JSON Schema validation
  
**User authentication and authorization**
  * Using JSON Web Tokens 
  * Created on the back-end upon user registration or login
  * Stored on the front-end using React state and localStorage

**Tour Points System**
  * Points are updated on each round creation, update, or deletion
  * Points are aggregated and displayed for each golfer by tournament and by season
  * Point Generating Events
    * The lowest 5 net strokes finishers for each tournament
    * The lowest 3 total putts finishers for each tournament
    * Each greenie generates 1 to 4 points depending on distance from pin
    * Each par, birdie, eagle, and ace generates points
    * Each round played generates 3 points

**Handicap System**
  * Total Strokes: raw sum of strokes for all 18 holes
  * Score Differential: (113 / Slope) * (Total Strokes - Rating)
  * Handicap Index: average of lowest two rounds out of the last four
  * Course Handicap: (Handicap Index * Slope) / 113
  * Net Strokes: Total Strokes - Course Handicap

## Tech Stack
* [React](https://reactjs.org/)
* [Express](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [React-Bootstrap](https://react-bootstrap.github.io/)
* [Bootstrap 5](https://getbootstrap.com/docs/5.1/getting-started/introduction/)
* JavaScript
* HTML
* CSS


## Testing
* 104 front-end tests with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
* 180 back-end tests with [SuperTest](https://www.npmjs.com/package/supertest)
* Run using "npm test"