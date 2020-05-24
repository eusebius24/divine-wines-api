# DivineWines API Documentation


Easy-to-use journal software for the wine enthusiast.  

![DivineWines landing page](https://github.com/eusebius24/divinewines-app/blob/master/public/DivineWines1.png)
![DivineWines Home Page](https://github.com/eusebius24/divinewines-app/blob/master/public/DivineWines2.png)

**Live app link:** [https://divinewines-app.now.sh](https://divinewines-app.now.sh)

**API Documentation:** [https://github.com/eusebius24/divine-wines-api/](https://github.com/eusebius24/divine-wines-api/)

**Description**: DivineWines is a full-stack app allowing wine enthusiasts to catalogue and search wines they've tasted or want to try.  The current version allows the user to add wines, edit journal entries, and search by vintner, name, varietal, year, region, and other parameters.  Planned additions include user authentication, filtering searches, and adding custom regions and varietals.

**Technologies Used**: HTML5, CSS3, JS, ES6, React, Node.js, Express, Knex, PostgreSQL

--
**URL**: [https://safe-escarpment-69594.herokuapp.com/api/records/](https://safe-escarpment-69594.herokuapp.com/api/records/)

* **Method**: `GET`, `POST`, `PATCH`, `DELETE`
* **Data Params**: `{ name: “name”, vintner: “vintner”, varietal: “varietal”, year: “year”, region: “region”, tasting_notes: “notes”, rating: 1 }`

 **Success Response**: 
`POST` Code: `201`
		
`GET` Code: `200`
		ame: “name”, vintner: “vintner”, varietal: “varietal”, year: “year”, region: “region”, tasting_notes: “notes”, rating: 1  }`
		
`PATCH` Code: `204`
		
`DELETE` Code: `204`

* **Error Response**:
		`POST` Code: `400`
		**Content**: ``{ error: { message: `Missing 'name' in request body` } }``
    `POST` Code: `400`
		**Content**: ``{ error: { message: `Year must be greater than 0` } }``

**Sample Calls:**
  `POST` `fetch('https://https://safe-escarpment-69594.herokuapp.com/api/records’,{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({name: “name”, varietal: “varietal”})})`
	`GET`  `fetch('https://https://safe-escarpment-69594.herokuapp.com/api/records’)`
	`PATCH` `fetch('https://https://safe-escarpment-69594.herokuapp.com/api/records/42’, { method: ‘PATCH’, headers: {content-type: ‘application/json’}, body: JSON.stringify({name: “name”})})`
	`DELETE`  `fetch('https://https://safe-escarpment-69594.herokuapp.com/api/records/42’, {method: ‘DELETE’})`
