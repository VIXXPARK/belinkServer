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
    var id = req.body.id;

    model.User.findAll({
        raw: true, 
        attributes: [[sequelize.fn('GROUP_CONCAT', sequelize.col('username')), 'teamName']],
        where:{
            id:{
                [Op.or]: id
            }
        }
    }).then((result) => {
        model.Team.create({
            teamName: result[0]['teamName'],
            createdAt:new Date().getTime(),
            updatedAt:new Date().getTime()
        }).then((resultB) => {
            for(const curId of id ){
                model.Member.create({
                    team_member: curId,
                    team_room: resultB.dataValues.id,
                    createdAt: resultB.dataValues.createdAt,
                    updatedAt: resultB.dataValues.updatedAt
                })
            }
        })
    })

    
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
    console.log(req.body);
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
    model.Member.delete({
        raw: true,
        where:{team_member:req.body.userId,team_room:req.body.teamId}
    })
    .then(result=>{
        if(result){
            model.Team.findOne({
                raw: true,
                where: {
                    id: req.body.teamId
                }
            }).then(result => {
                if(result.createdAt.valueOf() == result.updatedAt.valueOf()){
                    model.User.findAll({
                        //select GROUP_CONCAT(users.username) as teamName from members left join users on members.team_member = users.id WHERE members.team_room = 'ac281f30-491a-481f-ae2e-d45756e0e005';
                        raw: true, 
                        attributes: [[sequelize.fn('GROUP_CONCAT', sequelize.col('username')), 'teamName']],
                        include:[{
                            model:model.Member,as:'teamMember',
                            attributes:["team_room"],
                            where: {
                                team_room: result.id
                            }
                        }]
                    }).then(result => {
                        console.log(result)
                        model.Team.update({
                            teamName: result[0]['teamName'],
                            createdAt: sequelize.fn('NOW'),
                            updatedAt: sequelize.fn('NOW')
                        },{
                            where:{
                                id: result[0]['teamMember.team_room']
                            }
                        }).then(result => {
                            var bool = (result[0] == 1)
                            res.json({
                                success: bool
                            })
                        })
                    })
                }
                else{
                    res.json({
                        success: true
                    })
                }
            })
        }
        else{
            res.json({
                success: false
            })
        }
    })
}

exports.getMember = (req,res,next)=>{
    model.Member.findAll({
        raw: true,
        attributes: ['updatedAt'],
        where: {team_room:req.body.team_room},
        include: [{model:model.User,as:'teamMember',attributes:['id','username','phNum']},
                {model:model.Team,as:'teamRoom',attributes:['teamName']}],
        
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