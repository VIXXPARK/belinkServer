const router = require('express').Router()
const user =require('./user')
const location = require('./location');
const sms =require('./sms')
const prediction =require('./prediction')
const store =require('./store')

console.log( __dirname );
router.use('/user', user)
router.use('/location', location)
router.use('/sms', sms)
router.use('/prediction', prediction)
router.use('/store', store)

module.exports = router