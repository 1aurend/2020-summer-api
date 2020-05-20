import express from 'express'
import Airtable from 'airtable'
import { formatResourceData, formatResourceDataWithIds } from '../utils/schemas'
import fetchRecordIds from '../utils/fetchRecordIds'
import { createRecord } from '../utils/promisifiedCreate'
import { findRecord } from '../utils/promisifiedFind'
import { updateRecord } from '../utils/promisifiedUpdate'
require('dotenv').config()

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

router.post('/find', async (req, res) => {
    console.log(req.body);
    const findResource = findRecord(devBase, 'Resources', req.body.id)
    const resourceToUpdate = await findResource().catch(err => {throw new Error(err)})
    const creatorName = async () => {
      const findPerson = findRecord(devBase, 'LL_PEOPLE', resourceToUpdate.fields.Creator[0])
      return (await findPerson().catch(err => {throw new Error(err)})).fields.LLPeopleName
    }
    const toolNames = await Promise.all(
      resourceToUpdate.fields["Tool or Medium"].map(async id => {
        const findTool = findRecord(devBase, 'TOOLS_AND_MEDIA', id)
        return {
          id: id,
          name: (await findTool().catch(err => {throw new Error(err)})).fields['TOOL or MEDIA']
        }
      })
    )
    const removeUIDs = {
      ...resourceToUpdate.fields,
      //note that I made 'who are you?' a single select field for dev purposes; all the logic is done for this to be multi.
      Creator: {
        id: resourceToUpdate.fields.Creator[0],
        name: await creatorName()
      },
      "Tool or Medium": toolNames
    }
    const formattedResource = {...resourceToUpdate, fields: removeUIDs}
    console.log(JSON.stringify(formattedResource, null, 2));
    res.send({record: formattedResource})
  })

  router.post('/update', async (req, res) => {
    console.log(req.body);
    const updatedData = await formatResourceDataWithIds(req.body, devBase)
    console.log(updatedData);
    const updateResource = updateRecord(devBase, 'Resources', updatedData, req.body.id)
    const update = await updateResource().catch(err => {throw new Error(err)})
    res.status(200).send({record: update})
  })


  //test route for fetchRecordIds()
  router.get('/', async (req, res) => {
    res.send({result: await fetchRecordIds(['Lauren Davidson', 'Katie Gilligan'], devBase, 'LL_PEOPLE', 'LLPeopleName')})
  })

export default router
