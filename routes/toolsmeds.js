import express from 'express'
import Airtable from 'airtable'
import { formatToolMed } from '../utils/schemas'
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

router.post('/create', async (req, res) => {
  console.log(req.body);
  const newToolMed = formatToolMed(req.body)
  const createInBaseOne = createRecord(devBase, 'TOOLS_AND_MEDIA', newToolMed)
  const createInBaseTwo = createRecord(dupBase, 'TOOLS_AND_MEDIA', newToolMed)
  const updates = await Promise.all([
    // QUESTION: what is the best workflow for handling these errors? should the error handler send a slack, etc?
    createInBaseOne().catch(err => {return err}),
    createInBaseTwo().catch(err => {return err})
  ]).then(vals => {return {1: vals[0], 2: vals[1]}})
  console.log(updates)
  res.send({result: updates})
})


export default router
