const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeRecordsArray } = require('./divinewines.fixtures')

describe('Divine Wines Endpoints', function() {
    let db 

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('wines').truncate())

    afterEach('cleanup', () => db('wines').truncate())

    describe('GET /api/records', () => {
        context(`Given no records`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/records')
                    .expect(200, [])
            })
        })
        context('Given there are records in the database', () => {
            const testRecords = makeRecordsArray()
    
           beforeEach('insert records', () => {
               return db
                .into('wines')
                .insert(testRecords)
           })
    
           it('GET /api/records responds with 200 and all of the records', () => {
               return supertest(app)
                .get('/api/records')
                .expect(200, testRecords)
                
           })
    
          
        })
    })

    describe(`GET /api/records/:record_id`, () => {
        context(`Given no records`, () => {
            it(`responds with 404`, () => {
                const recordId = 123456
                return supertest(app)
                    .get(`/api/records/${recordId}`)
                    .expect(404, { error: { message: `Record doesn't exist` } })
            })
        })

        context('Given there are records in the database', () => {

            const testRecords = makeRecordsArray()

            beforeEach('insert records', () => {
                return db
                 .into('wines')
                 .insert(testRecords)
            })

            it(`GET /api/records/:record_id responds with 200 and the specified record`, () => {
                const recordId = 2 
                const expectedRecord = testRecords[recordId - 1]
                return supertest(app)
                 .get(`/api/records/${recordId}`)
                 .expect(200, expectedRecord)
            })
        })

        context(`Given an XSS attack record`, () => {
            const maliciousRecord = {
                id: 911,
                name: `Naughty!  <script>alert('xss');</script>`,
                tasting_notes: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">.`
            }

            beforeEach('insert malicious record', () => {
                return db
                    .into('wines')
                    .insert([ maliciousRecord ])
            })

            it(`removes XSS attack content`, () => {
                return supertest(app)
                    .get(`/api/records/${maliciousRecord.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.name).to.eql('Naughty!  &lt;script&gt;alert(\'xss\');&lt;/script&gt;')
                        expect(res.body.tasting_notes).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">.`)
                    })
            })
        })
    })

    describe(`POST /api/records`, () => {
        
        it(`creates a record, responding with 201 and the new record`, function() {
            const newRecord = {
                name: 'Test new name',
                vintner: 'Test vintner'
            }
            return supertest(app)
                .post('/api/records')
                .send(newRecord)
                .expect(201)
                .expect(res => {
                    expect(res.body.name).to.eql(newRecord.name)
                    expect(res.body.vintner).to.eql(newRecord.vintner)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/records/${res.body.id}`)
                })
                .then(postRes => {
                    supertest(app)
                        .get(`/api/records/${postRes.body.id}`)
                        .expect(postRes.body)
                })
        })

        it (`responds with 400 and an error message when the 'name' is missing`, () => {
            return supertest(app)
                .post('/api/records')
                .send({
                    vintner: "Test",
                    varietal: 'Test'
                })
                .expect(400, {
                    error: { message: `Missing 'name' in request body` }
                })
        })
    })

    describe(`DELETE /api/records/:record_id`, () => {
        context(`Given no records`, () => {
            it(`responds with 404`, () => {
                const recordId = 123456
                return supertest(app)
                    .delete(`/api/records/${recordId}`)
                    .expect(404, { error: { message: `Record doesn't exist` } })
            })
        })
        context('Given there are records in the database', () => {
            const testRecords = makeRecordsArray()

            beforeEach(`insert records`, () => {
                return db
                    .into('wines')
                    .insert(testRecords)
            })

            it('responds wtih 204 and removes the record', () => {
                const idToRemove = 2 
                const expectedRecords = testRecords.filter(record => record.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/records/${idToRemove}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/records`)
                            .expect(expectedRecords)
                    )
            })
        })
    })

    describe.only(`PATCH /api/records/:record_id`, () => {
        context(`Given no records`, () => {
            it(`responds with 404`, () => {
                const recordId = 123456
                return supertest(app)
                    .patch(`/api/records/${recordId}`)
                    .expect(404, { error: { message: `Record doesn't exist` }})
            })
        })

        context('Given there are records in the database', () => {
            const testRecords = makeRecordsArray()

            beforeEach(`insert records`, () => {
                return db
                    .into('wines')
                    .insert(testRecords)
            })

            it(`responds with 204 and updates the article`, () => {
                const idToUpdate = 2 
                const updateRecord = {
                    name: 'updated name',
                    vintner: 'updated vintner'
                }
                const expectedRecord = {
                    ...testRecords[idToUpdate - 1],
                    ...updateRecord
                }
                return supertest(app)
                    .patch(`/api/records/${idToUpdate}`)
                    .send(updateRecord)
                    .expect(204)
                    .then(res => 
                      supertest(app)
                        .get(`/api/records/${idToUpdate}`)
                        .expect(expectedRecord)
                    )
            })

            it(`responds with 400 when name field is not supplied`, () => {
                const idToUpdate = 2 
                return supertest(app)
                    .patch(`/api/records/${idToUpdate}`)
                    .send({ stupidField: 'pfthhhhh' })
                    .expect(400, {
                        error: {
                            message: `Request body must contain 'name'`
                        }
                    })
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2 
                const updateRecord = {
                    name: 'updated name'
                }
                const expectedRecord = {
                    ...testRecords[idToUpdate - 1],
                    ...updateRecord
                }

                return supertest(app)
                    .patch(`/api/records/${idToUpdate}`)
                    .send({
                        ...updateRecord,
                        fieldToIgnore: `should not be in GET response`
                    })
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/records/${idToUpdate}`)
                            .expect(expectedRecord)
                        )
            })
        })
    })
    
})