import express from 'express'
import Airtable from 'airtable'
require('dotenv').config()


const router = express.Router()
const key = process.env.AT_KEY
var base = new Airtable({apiKey: key}).base('appiLUFhewofNGI3D');

async function asyncForEach(array, callback) {
  for (let i = 0; i < array.length; i++) {
    await callback(array[i], i, array)
  }
}

const PERSON = {
  firstName: '',
  lastName: '',
  email: '',
  role: '',
}

const ROLES = [
  'LL Staff',
  'LLUF',
  'LLGF',
  'DiTF',
  'LLMF',
]

router.get('/list', async (req, res) => {
  let peopleList = []
  await base('LL_PEOPLE').select({
      maxRecords: 300,
      view: "Grid view"
  }).eachPage((records, fetchNextPage) => {
      const result = records.map(record => {
        return record.get('LLPeopleName')
      })
      peopleList = peopleList.concat(result).flat()
      fetchNextPage()
  }).catch(err => console.error(err))

  console.log(peopleList)
  return res.send({people: peopleList})
})


export default router
