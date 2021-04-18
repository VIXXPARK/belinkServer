const model = require('../../../models')
const jwt = require('jsonwebtoken');
const key = require('../../../key');
const { Sequelize } = require('../../../models');
const Op = Sequelize.Op

exports.register = (req,res)=>{
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        var phNum = req.body.phNum
        if((data==null || data==undefined)==false){
            res.json({
                success:false,
                data:"already exists"
            })
        }else if(phNum.length!=13){
            res.json({
                success:false,
                data:"휴대전화 번호 길이가 다릅니다."
            })
        }
        else{
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

exports.contactUser = (req,res,next)=>{
    console.log(req.body.phNum)

    model.User.findAll({
        attributes:["id","phNum","username"],
        where:{
            "phNum":req.body.phNum
        }
    })
    .then(result=>{
        res.json({
            data:result
        })
    })
}


exports.idContactUser = (req,res,next)=>{
    console.log(req.body.phNum)

    model.User.findAll({
        attributes:["id","phNum","username"],
        where:{
            "id":req.body.id
        }
    })
    .then(result=>{
        res.json({
            data:result
        })
    })
}


exports.login = (req,res,next)=>{
    console.log(req.body)
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        console.log(data)
        if(!data){
            return res.status(404).send({message:"User not found"})
        }
        var token = jwt.sign(
            {
                id:data.id,
                username:data.username,
                phNum:data.phNum,
                active:data.active
            },key.secretKey,{
                expiresIn:'30d',
                issuer:'belink',
                subject:'userInfo'
            }
        );
        console.log(token)
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
        if(req.body.teamName==null){
            res.json({
                success:false
            })
        }
        res.json({
            success:true,
            id:result.id
        })
    })
    .catch(err=>res.status(404).json({
        success:false,
        msg:err
    }))
}

exports.editTeam = (req,res,next)=>{
    model.Team.update({
        teamName:req.body.teamName},
        {where:{id:req.body.id}
    })
    .then(result=>{
        var bool = result[0]==1
        res.json({
            success:bool
        })
    })
}

exports.deleteTeam = (req,res,next)=>{
    model.Member.destroy({
        where:{team_room:req.body.id}
    })
    .then((result)=>{
        console.log("result: ",result)
        model.Team.destroy({
            where:{id:req.body.id}
        })
        .then(fin=>{
            console.log("fin: ", fin)
            var bool = fin==1
            res.json({
                success:bool
            })
        })
    })
    
}



exports.makeMember = (req,res,next)=>{
    console.log(req.body)
    model.Member.bulkCreate(req.body,{returning:true})
    .then(result=>{
        res.json({
            success:true
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
        return model.Friend.findAll()
    })
    .then(response =>{
       
        res.json({
            success:true,
            data:response
        })
    })
    .catch(err=>{
        res.status(404).json({
            success:false,
            message:err
        })
    })
}

exports.getMyFriend = (req,res,next)=>{
    model.Friend.findAll({
        attributes:[],
        where:{device:req.decoded.id,hidden:false},
        include:[
                {model:model.User,as:'myFriendUser',attributes:["id","phNum","username"]}]
    })
    .then(result=>{
        if(result.length==0){
            res.status(404).json({
                msg:"err"
            })
        }
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
                var bool = result[0]==1
                res.json({
                    success:bool
                })
            })
}

exports.deleteUser = (req,res,next)=>{
    model.User.destroy({
        where:{id:req.decoded.id}
    })
    .then(result=>{
        var bool = result[0]==1
        res.json({
            success:bool
        })
    })
}

exports.deleteMember = (req,res,next)=>{
    model.Member.destroy({
        where:{team_member:req.body.userId,team_room:req.body.teamId}
    })
    .then(result=>{
        var bool = result[0]==1
        res.json({
            success:bool
        })
    })
}

exports.getMember = (req,res,next)=>{
    model.Member.findAll({
        attributes:[],
        where:{team_room:req.body.team_room},
        include:[{model:model.User,as:'teamMember',attributes:['id','username','phNum']}],
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
        if(req.body.team_member == null){
            res.status(404).json({
                msg:"id가 없습니다."
            })
        }
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
        var bool = result[0]==1
        res.json({
            success:bool
        })
    })
}