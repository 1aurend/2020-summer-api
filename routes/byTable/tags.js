import express from 'express'
import Airtable from 'airtable'
import { formatTagData } from '../../utils/schemas'
import { createRecord } from '../../utils/promisifiedCreate'
require('dotenv').config()

const router = express.Router()
const key = process.env.AT_KEY
const devBase = new Airtable({apiKey: key}).base('appiLUFhewofNGI3D');
const dupBase = new Airtable({apiKey: key}).base('appuSugdO02qPnW3D');

//dummy route until I figure out a better way to get the tags list
router.get('/resourcetypes', (req, res) => {
  const options = [
    "ll_created",
    "externally_created",
    "adobe_spark",
    "github_repo",
    "youtube_video",
    "ll_curated",
    "website",
    "google_doc",
    "vimeo_video",
    "github_page"
  ]
  res.status(200).send({options: options})
})


export default router
