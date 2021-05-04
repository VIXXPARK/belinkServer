const router = require('express').Router()
const user =require('./user')
const location = require('./location');

router.use('/user', user)
router.use('/location', location)
module.exports = router