const model = require('../../../models')
const jwt = require('jsonwebtoken');
const key = require('../../../key');
const { Sequelize } = require('sequelize');
const sequelize = require('sequelize');
const Op = Sequelize.Op;

console.log( __dirname );

exports.register = (req,res)=>{
    model.User.findOne({
        where:{
            [Op.or] :[
                {phNum: req.body.phNum},
                {username: req.body.username}
            ]
            //phNum이랑 username 중 하나라도 일치하는게 있는지 찾기
        }
    })
    .then((data)=>{
        var phNum = req.body.phNum
        if((data==null || data==undefined)==false){
            res.json({
                success:false,
                data:"already exists"
            })
        }else if(phNum.length!=11){
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
    
    res.redirect('/user');
}

exports.getUser = (req,res,next)=>{
    console.log(req.body.phNum);
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        if((data==null || data==undefined)==false){
            res.redirect('./user-page/'+data.dataValues.id);
            /*
            res.json({
                success:true,
                data:data
            })*/
        
        }
        else{
            res.redirect('./getuser-page');
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
    var friendId = req.body.friend;

    model.User.findAll({
        raw: true, 
        attributes: [[sequelize.fn('GROUP_CONCAT', sequelize.col('username')), 'teamName']],
        where:{
            id:{
                [Op.or]: friendId
            }
        }
    }).then((result) => {
        model.Team.create({
            teamName: result[0]['teamName'],
            createdAt:new Date().getTime(),
            updatedAt:new Date().getTime()
        }).then((resultB) => {
            //여기서 for문 안쓸수 있는 방법이 없을까..?
            for(const curId of friendId )
            model.Member.create({
                team_member: curId,
                team_room: resultB.dataValues.id,
                createdAt: resultB.dataValues.createdAt,
                updatedAt: resultB.dataValues.updatedAt
            })
        })
    })
    //이렇게 하면 makeMember가 필요 없을 지도..?

    
    /*
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
    */
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
        
        return model.Friend.findAll()
    })
    .then(response =>{
        if(response.device==null || response.myFriend==null){
            res.json({
                success:false,
            })
        }
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
        where:{device: req.body.id,
                hidden: 0},
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
        where:{id:req.params.id}
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
        attributes:['updatedAt'],
        where:{team_room:req.body.team_room},
        include:[{model:model.User,as:'teamMember',attributes:['id','username','phNum']},
                {model:model.Team,as:'teamRoom',attributes:['id','teamName','phNum']}],
        
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