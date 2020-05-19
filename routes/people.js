import express from 'express'
import Airtable from 'airtable'
import { formatPersonInfo } from '../utils/schemas'
import { createRecord } from '../utils/promisifiedCreate'
require('dotenv').config()

const router = express.Router()
const key = process.env.AT_KEY
const devBase = new Airtable({apiKey: key}).base('appiLUFhewofNGI3D');
const dupBase = new Airtable({apiKey: key}).base('appuSugdO02qPnW3D');


router.get('/list', async (req, res) => {
  let peopleList = []
  await devBase('LL_PEOPLE').select({
      maxRecords: 300,
      view: "Grid view"
  }).eachPage((records, fetchNextPage) => {
      const result = records.filter(record => {
        return /2019|2020/.test(record.get('Active'))}) //only works on flattened table where 'Active' type is string
      .map(record => {
        return record.get('LLPeopleName')
      })
      peopleList = peopleList.concat(result).flat()
      fetchNextPage()
  }).catch(err => console.error(err))

  console.log(peopleList)
  return res.send({people: peopleList})
})


router.post('/create', async (req, res) => {
  const newPerson = formatPersonInfo(req.body)
  const createInBaseOne = createRecord(devBase, 'LL_PEOPLE', newPerson)
  const createInBaseTwo = createRecord(dupBase, 'LL_PEOPLE', newPerson)
  const updates = await Promise.all([
    // QUESTION: what is the best workflow for handling these errors? should the error handler send a slack, etc?
    createInBaseOne().catch(err => {return err}),
    createInBaseTwo().catch(err => {return err})
  ]).then(vals => {return vals[0]})
  console.log(updates)
  if (updates.error) {
    console.log('here');
    res.status(400).send('Add to airtable failed. Get in touch with us.')
  }
  res.send({result: updates})
})

router.post('/createwithid', async (req, res) => {
  const newPerson = formatPersonInfo(req.body.data)
  const createInBaseOne = createRecord(devBase, 'EMPTYLLPEOPLE', newPerson)
  const masterRecord = await createInBaseOne().catch(err => {throw new Error(err)})
  const newPersonWithID = formatPersonInfo(req.body.data, masterRecord.id)
  const createInBaseTwo = createRecord(dupBase, 'EMPTYLLPEOPLE', newPersonWithID)
  const secondaryRecord = await createInBaseTwo().catch(err => {throw new Error(err)})
  res.send({result: {1: masterRecord, 2: secondaryRecord}})
})



export default router
