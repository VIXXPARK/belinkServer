const router = require('express').Router()
const controller = require('./controller')

console.log( __dirname );
router.post('/send-msg',controller.sendMsg);       
router.post('/send-code',controller.sendCode);

module.exports = router