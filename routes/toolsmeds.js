import express from 'express'
import Airtable from 'airtable'
import { formatTagData } from '../utils/schemas'
import { createRecord } from '../utils/promisifiedCreate'
require('dotenv').config()

const router = express.Router()
const key = process.env.AT_KEY
const devBase = new Airtable({apiKey: key}).base('appiLUFhewofNGI3D')
const dupBase = new Airtable({apiKey: key}).base('appuSugdO02qPnW3D')


router.get('/list', async (req, res) => {
  const records = await devBase('TOOLS_AND_MEDIA')
    .select()
    .all()
    .catch(err => console.log(err))
    .then(vals => {return vals})
  console.log(records)
  res.status(200).send('OK')
})

export default router
