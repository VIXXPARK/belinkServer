const router = require('express').Router()
const user =require('./user')
const location = require('./location');
const push = require('./push');

router.use('/user', user)
router.use('/location', location)
router.use('/push', push)

module.exports = router