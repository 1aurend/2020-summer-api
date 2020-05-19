import express from 'express'
import Airtable from 'airtable'
import { formatResourceData, formatResourceDataWithIds } from '../utils/schemas'
import { createRecord } from '../utils/promisifiedCreate'
import { findRecord } from '../utils/promisifiedFind'
import { updateRecord } from '../utils/promisifiedUpdate'
require('dotenv').config()
import fetchRecordIds from '../utils/fetchRecordIds'

const router = express.Router()
const key = process.env.AT_KEY
const devBase = new Airtable({apiKey: key}).base('appiLUFhewofNGI3D')
const dupBase = new Airtable({apiKey: key}).base('appuSugdO02qPnW3D')


router.post('/submit', async (req, res) => {
  console.log(req.body);
  const newResource = formatResourceDataWithIds(req.body, devBase)
  const createResource = createRecord(devBase, 'Resources', newResource)
  const record = await createResource().catch(err => {throw new Error(err)})
  res.send({record: record})
})

router.route('/update')
  .get(async (req, res) => {
    const findResource = findRecord(devBase, 'Resources', req.body.id)
    const resourceToUpdate = await findResource().catch(err => {throw new Error(err)})
    res.send({record: resourceToUpdate})
  })
  .post(async (req, res) => {
    console.log(req.body);
    const updatedData = await formatResourceData(req.body, devBase)
    const updateResource = updateRecord(devBase, 'Resources', updatedData. req.body.id)
    const update = await updateResource().catch(err => {throw new Error(err)})
    res.status(200).send(`Resource ${update.fields.Title} successfully updated`)
  })


  //test route for fetchRecordIds()
  router.get('/', async (req, res) => {
    res.send({result: await fetchRecordIds(['Lauren Davidson', 'Katie Gilligan'], devBase, 'LL_PEOPLE', 'LLPeopleName')})
  })

export default router
