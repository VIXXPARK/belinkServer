const router = require('express').Router()
const user =require('./user')
const location = require('./location');
const push = require('./push');
const store= require('./store');
const sms= require('./sms');
const prediction = require('./prediction');

router.use('/user', user)
router.use('/location', location)
router.use('/push', push)
router.use('/store',store)
router.use('/sms',sms);
router.use('/prediction',prediction);
module.exports = router