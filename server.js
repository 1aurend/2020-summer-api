import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'

//universal routes that will hopefully supercede the table-specific ones below
import list from './routes/list'
import find from './routes/find'
import create from './routes/create'
import update from './routes/update'

//table-specific routes for (copies of) resourceBase
import people from './routes/byTable/people'
import toolsmeds from './routes/byTable/toolsmeds'
import resources from './routes/byTable/resources'
import tags from './routes/byTable/tags'


const app = express()

require('dotenv').config()

const whiteList = [
  'http://localhost:3000',
  'http://localhost:3000/*',
  'https://localhost:3000',
  'https://localhost:3000/*',
  'https://block--i-l-u-fhewof-n-g-i3-d--9058w0r.airtableblocks.com'
]
const corsOpts = {
  origin: (origin, callback) => {
    if (whiteList.includes(origin) || !origin) {
      return callback(null, true)
    }
    callback(new Error('Request not allowed by CORS'))
  }
}
app.use(cors(corsOpts))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(logger('dev'))

app.get('/api', (req, res) => {
  res.send('server is up')
})

app.use('/list', list)
app.use('/find', find)

app.use('/people', people)
app.use('/tags', tags)
app.use('/resources', resources)
app.use('/toolsmeds', toolsmeds)
// app.use('/', express.static(path.join(__dirname, '/client/build')))
// app.use('/react(/*)?', express.static(path.join(__dirname, '/client/build')))


app.listen(8080, () => console.log(`Listening on port 8080`))
