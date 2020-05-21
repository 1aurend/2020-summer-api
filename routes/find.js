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


router.post('/:base/:table/:id',
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

async function replaceUID(base, table, id) {
  console.log('in replaceUID');
  console.log(id);
  const finder = findRecord(base, table, id)
  const record = await finder().catch(err => {
    console.log(new Error(err))
    // res.status(404).send(`sorry! we couldn't find ${req.params.id}`)
    return 'err'
  })
  //another thing to argue for-- a tag of "humanReadableTitle"
  return {id: id, name: record.fields[Object.keys(record.fields)[0]]}
}

router.post('/human/:base/:table/:id',
  async (req, res, next) => {
    const base = await new Airtable({apiKey: key}).base(BASELOOKUP[req.params.base])
    const table = req.params.table
    const finder = findRecord(base, table, req.params.id)
    const record = await finder().catch(err => {
      console.log(new Error(err))
      res.status(404).send(`sorry! we couldn't find ${req.params.id}`)
      return 'err'
    })
    console.log(JSON.stringify(record, null, 2))
    const fields = record.fields
    const matches = Object.entries(fields)
      .map(async ([field, value]) => {
        const table = field.split('@')[1]
        const type = _.isString(value) ? 'string' : Array.isArray(value) ? 'array' : null
        // console.log(field +' : '+ type);
        switch (type) {
          case 'string':
            if (/(rec)([A-Za-z0-9]{14})/.test(value)) {
              const readable = await replaceUID(base, table, value).catch(err => {return err})
              return readable
            }
            return value
            break
          case 'array':
            if (/(rec)([A-Za-z0-9]{14})/.test(value[0])) {
              const test = value.map( async id => {
                const finder = findRecord(base, table, id)
                const record = await finder().catch(err => {
                  console.log(new Error(err))
                  // res.status(404).send(`sorry! we couldn't find ${req.params.id}`)
                  return 'err'
                })
                // const readable = await replaceUID(base, table, id).catch(err => {return err})
                console.log('in switch');
                // console.log(record);
                return record.fields[Object.keys(record.fields)[0]]
              })
              return test
            }
            return value
            break
          default:
            return value
        }
      })
      // .flat(2)
    // console.log(matches.flat());
    const newTest = await Promise.all(matches.flat()).then(async vals => {
      await Promise.all(vals)} ).then(data => console.log(data))
    console.log('newTest');
    console.log(newTest);
    res.status(200).send({result: newTest})
  }
  )
    // const removeUIDs = {
    //   ...resourceToUpdate.fields,
    //   //note that I made 'who are you?' a single select field for dev purposes; all the logic is done for this to be multi.
    //   Creator: {
    //     id: resourceToUpdate.fields.Creator[0],
    //     name: await creatorName()
    //   },
    //   "Tool or Medium": toolNames
    // }
    // const formattedResource = {...resourceToUpdate, fields: removeUIDs}
    // console.log(JSON.stringify(formattedResource, null, 2));
    // res.send({record: formattedResource})


  export default router
