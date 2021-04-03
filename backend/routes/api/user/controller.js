const model = require('../../../models')

exports.register = (req,res)=>{
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        if((data==null || data==undefined)==false){
            res.json({
                success:false,
                msg:"already exists"
            })
        }else{
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
        }
        
    })
    
    
}

exports.getUser = (req,res,next)=>{
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        if((data==null || data==undefined)==false){
            res.json({
                success:true,
                data:data
            })
        }
    })
   
}

exports.makeGroup = (req,res,next)=>{
    model.Group.create({
        groupName:req.body.groupName,
        createdAt:new Date().getTime(),
        updatedAt:new Date().getTime()
    })
    .then(result=>{
        res.json({
            success:true,
            data:result
        })
    })
}

exports.makeMember = (req,res,next)=>{
    model.Member.bulkCreate(req.body,{returning:true})
    .then(result=>{
        res.json({
            success:true,
            data:result
        })
    })
    .catch(err=>{
        res.status(404).json({
            success:false,
            message:err
        })
    })
}