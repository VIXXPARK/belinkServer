const router = require('express').Router()
const controller = require('./controller')

console.log( __dirname );
router.post('/signup',controller.signup);       

module.exports = router