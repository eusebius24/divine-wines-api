# DivineWines API Documentation

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
