import express from 'express'
import logger from 'morgan'
import bodyParser from 'body-parser'
import path from 'path'
import cors from 'cors'

import people from './routes/people'
import tools from './routes/tools'
import submit from './routes/submit'


const app = express()

require('dotenv').config()

const whiteList = ['http://localhost:3000', 'https://localhost:3000']
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

// app.use('/people', people)
// app.use('/tools', tools)
// app.use('/submit', submit)
// app.use('/', express.static(path.join(__dirname, '/client/build')))
// app.use('/react(/*)?', express.static(path.join(__dirname, '/client/build')))


app.listen(8080, () => console.log(`Listening on port 8080`))
