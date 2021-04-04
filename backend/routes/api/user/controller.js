const model = require('../../../models')
const jwt = require('jsonwebtoken');
const key = require('../../../key')


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


exports.login = (req,res,next)=>{
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        if(!data){
            return res.status(404).send({message:"User not found"})
        }
        var token = jwt.sign(
            {
                username:data.username,
                phNum:data.phNum,
                active:data.active
            },key.secretKey,{
                expiresIn:'30d',
                issuer:'belink',
                subject:'userInfo'
            }
        );
        res.json({
            success:true,
            accessToken:token
        })

    })
    .catch(err=>{
        res.status(500).send({message:err.message})
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

exports.makeFriend = (req,res,next)=>{
    model.Friend.bulkCreate(req.body,{returning:true})
    .then(result=>{
        res.json({
            success:true,
            data:result
        })
    })
}

exports.getMyFriend = (req,res,next)=>{
    console.log(req.body.id)
    model.Friend.findAll({
        attributes:['hidden','updatedAt'],
        where:{device:req.body.id},
        include:[{model:model.User,as:'deviceUser',attributes:['id','username','phNum']},
                {model:model.User,as:'myFriendUser',attributes:['id','username','phNum']}],
    })
    .then(result=>{
        res.json({
            data:result
        })
    })
    .catch(err=>res.status(404).send(err))
}

