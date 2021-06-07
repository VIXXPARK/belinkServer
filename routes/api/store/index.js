const router = require('express').Router()
const controller = require('./controller')

console.log( __dirname );
router.post('/signup',controller.signup);  
router.post('/get-pending',controller.getPending);  
router.post('/accept-pending',controller.acceptPending);  
router.post('/reject-pending',controller.rejectPending);       

module.exports = router