const router = require('express').Router()
const controller = require('./controller')

router.post('/signup',controller.register)
router.get('/',(req,res)=>{
    res.json({
        success:true,
        data:"hello"
    })
})
router.post('/test',controller.test)
module.exports = router