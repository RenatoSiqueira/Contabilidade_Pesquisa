const express = require('express')
const router = express.Router()

const indexController = require('../controllers')

router
    .get('/', indexController.Home)
    .post('/', indexController.SaveData)
    .get('/success', indexController.Success)
    .get('/resultados', indexController.Charts)

module.exports = router