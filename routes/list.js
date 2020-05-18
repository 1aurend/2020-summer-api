import express from 'express'
import Airtable from 'airtable'
import { BASELOOKUP } from '../utils/baselookup'

require('dotenv').config()

const router = express.Router()
const key = process.env.AT_KEY


router.get('/:base/:table', async (req, res) => {
  const base = await new Airtable({apiKey: key}).base(BASELOOKUP[req.params.base])
  const table = req.params.table
  const records = await base(table)
    .select()
    .all()
    .catch(err => console.log(err))
    .then(vals => {return vals})
  res.status(200).send({records: records})
})

export default router
