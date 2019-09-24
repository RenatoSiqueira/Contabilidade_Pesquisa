require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 3000

const Routes = require('./routes')

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(Routes)

app.listen(PORT, () => console.log('Running...'))