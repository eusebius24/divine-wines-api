const path = require('path')
const express = require('express')
const xss = require('xss')
const DivineWinesService = require('./divinewines-service')

const divineWinesRouter = express.Router()
const jsonParser = express.json()

divineWinesRouter
    .route('/')
    .get((req, res, next) => {
        DivineWinesService.getAllRecords(
            req.app.get('db')
        )
    .then(records => {
      res.json(records)
    })
    .catch(next)
})
    .post(jsonParser, (req, res, next) => {
        const { name, vintner, varietal, region, year, tasting_notes, rating } = req.body
        const newRecord = { name, vintner, varietal, region, year, tasting_notes, rating }
        console.log("newRecord: ", newRecord);
        if(!name) {
            return res.status(400).json({
                error: { message: `Missing 'name' in request body` }
            })
        }
        if(year && parseInt(year) < 0) {
            return res.status(400).json({
                error: { message: `Year must be greater than 0` }
            })
        }
        DivineWinesService.insertRecord(
          req.app.get('db'),
          newRecord
        )
          .then(record => {
            res
              .status(201)
              .location(path.posix.join(req.originalUrl, `/${record.id}`))
              .json(record)
          })
          .catch(next)
    })


divineWinesRouter
          .route('/:record_id')
          .all((req, res, next) => {
              DivineWinesService.getById(
                  req.app.get('db'),
                  req.params.record_id
              )
                .then(record => {
                    if (!record) {
                        return res.status(404).json({
                            error: { message: `Record doesn't exist` }
                        })
                    }
                    res.record = record
                    next()
                })
                .catch(next)
          })
          .get((req, res, next) => {
              res.json({
                id: res.record.id,
                name: xss(res.record.name),
                vintner: xss(res.record.vintner),
                varietal: xss(res.record.varietal),
                region: xss(res.record.region),
                rating: res.record.rating,
                year: res.record.year,
                tasting_notes: xss(res.record.tasting_notes)
              })
          })
          .delete((req, res, next) => {
              DivineWinesService.deleteRecord(
                  req.app.get('db'),
                  req.params.record_id
              )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
          })
          .patch(jsonParser, (req, res, next) => {
            const { name, vintner, varietal, region, year, tasting_notes, rating } = req.body
            const recordToUpdate = { name, vintner, varietal, region, year, tasting_notes, rating }
            
            DivineWinesService.updateRecord(
                req.app.get('db'),
                req.params.record_id,
                recordToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
          })

module.exports = divineWinesRouter