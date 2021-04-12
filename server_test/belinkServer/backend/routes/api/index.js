const router = require('express').Router()
const user =require('./user')
const location = require('./location');

console.log( __dirname );
router.use('/user', user)
router.use('/location', location)

module.exports = router