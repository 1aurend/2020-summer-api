import express from 'express'
import Airtable from 'airtable'
import { formatResourceData } from '../utils/schemas'
import { createRecord } from '../utils/promisifiedCreate'
require('dotenv').config()
import fetchRecordIds from '../utils/fetchRecordIds'

const router = express.Router()
const key = process.env.AT_KEY
const devBase = new Airtable({apiKey: key}).base('appiLUFhewofNGI3D')
const dupBase = new Airtable({apiKey: key}).base('appuSugdO02qPnW3D')

//test route for fetchRecordIds()
router.get('/', async (req, res) => {
  res.send({result: await fetchRecordIds(['Lauren Davidson', 'Katie Gilligan'], devBase, 'LL_PEOPLE', 'LLPeopleName')})
})

router.post('/submit', async (req, res) => {
  console.log(req.body);
  const newResource = await formatResourceData(req.body, devBase)
  const createResource = createRecord(devBase, 'Resources', newResource)
  const record = await createResource().catch(err => {throw new Error(err)})
  res.send({result: record})
})

export default router
