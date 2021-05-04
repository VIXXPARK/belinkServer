const router = require('express').Router()
const controller = require('./controller')

console.log( __dirname );
router.post('/get-prediction',controller.getPrediction);       
router.post('/make-prediction',controller.makePrediction);

module.exports = router