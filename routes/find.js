import express from 'express'
import Airtable from 'airtable'
import { BASELOOKUP } from '../utils/baselookup'
import _ from 'lodash'

import { formatResourceData, formatResourceDataWithIds } from '../utils/schemas'
import fetchRecordIds from '../utils/fetchRecordIds'
import { createRecord } from '../utils/promisifiedCreate'
import { findRecord } from '../utils/promisifiedFind'
import { updateRecord } from '../utils/promisifiedUpdate'
require('dotenv').config()

const router = express.Router()
const key = process.env.AT_KEY


router.get('/:base/:table/:id',
  async (req, res) => {
    const base = await new Airtable({apiKey: key}).base(BASELOOKUP[req.params.base])
    const table = req.params.table
    const finder = findRecord(base, table, req.params.id)
    const record = await finder().catch(err => {
      console.log(new Error(err))
      res.status(404).send(`sorry! we couldn't find ${req.params.id}`)
      return 'err'
    })
    console.log(JSON.stringify(record, null, 2))
    if (record !== 'err') {
      res.status(200).send({record: record})
    }
  }
)


router.get('/human/:base/:table/:id',
  async (req, res) => {
    const base = await new Airtable({apiKey: key}).base(BASELOOKUP[req.params.base])
    const table = req.params.table
    const finder = findRecord(base, table, req.params.id)
    const record = await finder().catch(err => {
      console.log(new Error(err))
      res.status(404).send(`sorry! we couldn't find ${req.params.id}`)
      return 'err'
    })
    console.log('record from airtable:')
    console.log(JSON.stringify(record, null, 2))
    const fields = record.fields
    const matches = Promise.all( Object.entries(fields)
      .map(async ([field, value]) => {
        //Note: this depends on a field naming convention in which the linked table name is referenced in the field name!
        const table = field.split('@')[1]
        const type = _.isString(value) ? 'string' : Array.isArray(value) ? 'array' : null
        switch (type) {
          case 'string':
            if (/(rec)([A-Za-z0-9]{14})/.test(value)) {
              const finder = findRecord(base, table, id)
              return await finder()
                .catch(err => {
                  console.log(new Error(err))
                  res.status(404).send(`sorry! we couldn't find ${req.params.id}`)
                  return 'err'})
                .then(record => {
                  //luckily our first field seems to correspond to the name we'd want here, but this should also be guaranteed with a naming convention
                  return {[field]: {id: id, name: record.fields[Object.keys(record.fields)[0]]}}
                })
            }
            return Promise.resolve({[field]: value})
            break
          case 'array':
            if (/(rec)([A-Za-z0-9]{14})/.test(value[0])) {
              const readableVals = await (value.map(
                async id => {
                  const finder = findRecord(base, table, id)
                  return await finder()
                    .catch(err => {
                      console.log(new Error(err))
                      res.status(404).send(`sorry! we couldn't find ${req.params.id}`)
                      return 'err'})
                    .then(record => {
                      return {id: id, name: record.fields[Object.keys(record.fields)[0]]}
                    })
                  })
                )
              const ready = await Promise.all(readableVals).then(vals => {return vals})
              return {[field]: ready}
            }
            return Promise.resolve({[field]: value})
            break
          default:
            return Promise.resolve({[field]: value})
        }
      })).then(vals => {
        const readablefields = Object.assign(...vals.flat())
        const readableRecord = {...record, fields: readablefields}
        console.log('readable record:')
        console.log(JSON.stringify(readableRecord, null, 2))
        res.status(200).send({result: readableRecord})
      })
  })

  export default router
