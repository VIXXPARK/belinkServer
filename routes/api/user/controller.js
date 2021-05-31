const model = require('../../../models')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;
const { Sequelize } = require('../../../models');
const Op = Sequelize.Op

exports.register = (req,res)=>{ 
    /**
     * @params : phNum
     * @params : username
     * @params : token(기기 고유한 번호)
     */
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        var phNum = req.body.phNum
        if((data==null || data==undefined)==false){
            res.status(400).json({
                success:false,
                data:"이미 존재하는 유저입니다"
            })
        }else if(phNum.length!=13){ // XXX-XXXX-XXXX 형식으로 저장
            res.status(400).json({
                success:false,
                data:"휴대전화 번호 길이가 다릅니다."
            })
        }
        else{
            model.User.create({
                phNum:req.body.phNum,
                username:req.body.username,
                token:req.body.token
            })
            .then(result=>{
                res.status(201).json({
                    success:true,
                    data:result
                })
            })
        }
    })
}

exports.contactUser = (req,res,next)=>{
    /**
     * @params : phNum  [형식은 xxx-xxxx-xxxx입니다.]
     * 
     */
    model.User.findAll({
        attributes:["id","phNum","username"],
        where:{
            "phNum":req.body.phNum,
        }
    })
    .then(result=>{
        if(result==null || result==undefined||result.length==0){ 
            res.status(200).json({
                message:"해당되는 연락처가 없습니다."
            })
        }else{
            res.status(200).json({
                data:result
            })
        }
    })
    .catch(err=>{
        res.status(500).json({
            message:err
        })
    })
}


exports.idContactUser = (req,res,next)=>{
    /**
     * @params : id [ userId ]
     * id를 통한 연락처 조회
     */

    model.User.findAll({
        attributes:["id","phNum","username"],
        where:{
            "id":req.body.id
        }
    })
    .then(result=>{
        if(result==null || result==undefined||result.length==0){ 
            res.status(200).json({
                message:"해당되는 연락처가 없습니다."
            })
        }
        res.json({
            data:result
        })
    })
    .catch(err=>{
        res.status(500).json({
            message:err
        })
    })
}


exports.login = (req,res,next)=>{
    /**
     * @params : phNum
     * 휴대전화번호를 이용한 간편 로그인이기 때문에 휴대전화번호만 필요하다
     * 휴대전화번호 인증은 sms 디렉토리에 존재
     */
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        if(!data){
            return res.status(400).send({
                success:false,
                message:"존재하지 않은 유저입니다."
            })
        }
        var token = jwt.sign( //jwt토큰 생성
            {
                id:data.id,
                username:data.username,
                phNum:data.phNum,
                active:data.active
            },env.JWT_SECRET_KEY,{
                expiresIn:'30d',
                issuer:'belink',
                subject:'userInfo'
            }
        );
        res.json({
            success:true,
            accessToken:token,
            id:data.id
        })

    })
    .catch(err=>{
        res.status(500).send({message:err.message})
    })
}


exports.makeTeam = async (req,res,next)=>{
    /**
     * @params : teamName
     * 
     */
    if(req.body.teamName==null || req.body.teamName==""){
       await res.status(400).json({
            success:false,
            message:"팀 이름을 적어주세요"
        })
    }else{
        await model.Team.create({
            teamName:req.body.teamName,
            createdAt:new Date().getTime(),
            updatedAt:new Date().getTime()
        })
        .then(result=>{
            res.status(201).json({
                success:true,
                id:result.id
            })
        })
        .catch(err=>res.status(500).json({
            success:false,
            msg:err
        }))
    }
    
}

exports.editTeam = (req,res,next)=>{
    /**
     * @params : teamName
     * @params : id [team ID]
     */
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
        where:{team_room:req.query.id}
    })
    .then((result)=>{
        model.Team.destroy({
            where:{id:req.query.id}
        })
        .then(fin=>{
            var bool = fin==1
            res.status(200).json({
                success:bool
            })
        })
        .catch(err=>{
            res.status(500).json({
                success:false,
                message:"해당되는 그룹이 존재하지 않습니다."
            })
        })
    })
    .catch(err=>{
        res.status(500).json({
            success:false,
            message:"해당되는 그룹이 존재하지 않습니다."
        })
    })
}



exports.makeMember = (req,res,next)=>{
    /**
     * @body : [
     *              {
     * @params          team_room:"asfdads-dfasdfa-dsafsf",
     * @params          team_member:"wrwer-bsdfb-qwfwev2"
     *              }, 
     *              ...
     *          ]
     */
    if(req.body==null||req.body==undefined||req.body.length==0){ //유저정보가 안왔을 때
        res.status(400).json({
            success:false,
            message:"멤버를 선택해주세요"
        })
    }else{
      model.Team.findOne({
            where:{id:req.body[0].team_room}
        })
        .then(teamResult=>{
            if(teamResult==null || teamResult==undefined){ // 방이 제대로 만들어지지 않았을 때
                res.status(400).json({
                    success:false,
                    message:"제대로 된 그룹방이 아닙니다."
                })
            }
        })
        .then(async ()=>{
            await model.Accept.create({// 푸시 관련 서비스를 했을 때 필요한 테이블
                total: Object.keys(req.body).length,
                teamId: req.body[0].team_room
            })
            await model.Member.bulkCreate(//팀에 속하는 멤버 생성
                req.body,
                {
                    returning:true,
                    where:{team_member:{ne:null}}
            })
            .then(fin=>{
                res.json({
                    success:true
                })
            })
            .catch(err=>{
                res.status(400).json({
                    success:false,
                    message:err
                })
            })
        })
        
    }

    
}

exports.makeFriend = (req,res,next)=>{
    /**
     * @body : [
     *              {
     * @params          device:-----,
     * @params          myFriend:----,
     *              }
     *          ]
     */
    if(req.body==null || req.body==undefined||req.body.length==0){
        res.status(400).json({
            success:false,
            message:"요청된 값이 존재하지 않습니다."
        })
    }else{
        model.Friend.bulkCreate(req,
            {returning:true,
                where:{
                    myFriend:{ne:null}
            }})
            .then(()=>{
                res.json({
                    success:true
                })
            })
            .catch((err)=>{
                res.status(400).json({
                    success:false,
                    message:err
                })
            })
    }
    
}

exports.getMyFriend = (req,res,next)=>{
    //jwt 안에 들어있는 id 값을 통해 조회
    model.Friend.findAll({
        attributes:[],
        where:{device:req.decoded.id,hidden:false},
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
                var bool = result[0]==1
                res.json({
                    success:bool
                })
            })
}

exports.deleteUser = (req,res,next)=>{
    model.User.destroy({
        where:{id:req.decoded.id||req.body.id}
    })
    .then(result=>{
        var bool = result[0]==1
        res.status(200).json({
            success:bool
        })
    })
    .catch(err=>{
        res.status(500).json({
            success:false,
            message:'잘못된 정보입니다.'
        })
    })
}

exports.deleteMember = (req,res,next)=>{
    model.Member.destroy({
        where:{team_member:req.body.userId,team_room:req.body.teamId}
    })
    .then(result=>{
        var bool = result==1
        res.json({
            success:bool
        })
    })
}

exports.getMember = (req,res,next)=>{
    /**
     * @params : team_room [team ID]
     */
    model.Member.findAll({
        attributes:[],
        where:{team_room:req.query.team_room},
        include:[{model:model.User,as:'teamMember',attributes:['id','username','phNum']}],
    })
    .then(result=>{
        if(result.length==0){
            res.status(400).json({
                success:false,
                message:'잘못된 팀 정보입니다.'
            })
        }else{
            res.json({
                data:result
            })
        }
        
    })
    .catch(err=>res.status(500).json({
        success:false,
        message:err
    }))
}

exports.getMyTeam = (req,res,next)=>{
    model.Member.findAll({
        attributes:[],
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
            result
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

exports.testDelete = (req,res,next)=>{
    model.User.destroy({
        where:{phNum:req.body.phNum,username:req.body.username}
    })
    .then(result=>{
        
        res.json({
            success:result==1
        })
    })
}