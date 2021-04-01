const model = require('../../../models')

exports.register = (req,res)=>{
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        if((data==null || data==undefined)==false){
            res.json({
                success:false,
                msg:"already exists"
            })
        }
        model.User.create({
            phNum:req.body.phNum,
            username:req.body.username
        })
        .then(result=>{
            res.json({
                success:true,
                data:result
            })
        })
    })
    
    
}
