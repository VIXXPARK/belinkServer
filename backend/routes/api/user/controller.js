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


exports.makeTeam = (req,res,next)=>{
    model.Team.create({
        teamName:req.body.teamName,
        createdAt:new Date().getTime(),
        updatedAt:new Date().getTime()
    })
    .then(result=>{
        res.json({
            success:true,
            id:result.id
        })
    })
}

exports.editTeam = (req,res,next)=>{
    model.Team.update({
        teamName:req.body.teamName,
        where:{id:req.body.id}
    })
    .then(result=>{
        res.json({
            success:result
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
    model.Friend.findAll({
        attributes:[],
        where:{device:req.body.id,hidden:req.body.hidden},
        include:[
                {model:model.User,as:'myFriendUser',attributes:["id","phNum","username"]}]
    })
    .then(result=>{
        res.json({
            data:result
        })
    })
    .catch(err=>res.status(404).send(err))
}

exports.editUser = (req,res,next)=>{
    model.User.update({
                phNum:req.body.phNum,
                username:req.body.username
                },{
                where:{id:req.body.id}
            })
            .then(result=>{
                res.json({
                    success:result
                })
            })
}

exports.deleteUser = (req,res,next)=>{
    model.User.destroy({
        where:{id:req.params.id}
    })
    .then(result=>{
        res.json({
            success:result
        })
    })
}

exports.deleteMember = (req,res,next)=>{
    model.Member.destroy({
        where:{team_member:req.body.userId,team_room:req.body.teamId}
    })
    .then(result=>{
        res.json({
            success:result
        })
    })
}

exports.getMember = (req,res,next)=>{
    model.Member.findAll({
        attributes:['updatedAt'],
        where:{team_room:req.body.team_room},
        include:[{model:model.User,as:'teamMember',attributes:['id','username']},
                {model:model.Team,as:'teamRoom',attributes:['id','teamName']}],
        
    })
    .then(result=>{
        res.json({
            data:result
        })
    })
}

exports.getMyTeam = (req,res,next)=>{
    model.Member.findAll({
        attributes:['updatedAt'],
        where:{team_member:req.body.team_member},
        include:[{model:model.Team,as:'teamRoom',attributes:['id','teamName']}],
    })
    .then(result=>{
        res.json({
            data:result
        })
    })
}

exports.infectUser = (req,res,next)=>{
    model.User.update({
        infect:req.body.infect,
        },{where:{id:req.body.id}
    })
    .then(result=>{
        res.json({
            success:true
        })
    })
}