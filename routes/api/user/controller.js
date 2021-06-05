const model = require('../../../models')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const env = process.env;
const { Sequelize } = require('../../../models');
const Op = Sequelize.Op
const BAD_REQUEST=400
const OK=200
const INTERNAL_SERVER_ERROR=500
const CREATED = 201
const NOT_FOUND=404

exports.register = (req,res)=>{ 
    /**
     * @params : phNum
     * @params : username
     * @params : token(기기 고유한 번호)
     */
    model.User.findOne({where:{phNum:req.body.phNum}})
    .then((data)=>{
        var phNum = req.body.phNum
        if(dataSizeZero(data)==false){
            doesNotExists(res,"이미 존재하는 유저입니다")
        }else if(!isRightPhoneNumberLength(phNum)){ // XXX-XXXX-XXXX 형식으로 저장
            isNotMatchingLengthPhoneNumber(res)
        }
        else{
            model.User.create(userParameter(req))
            .then(result=>{
                makeUser(res,result)
            })
        }
    })
}

exports.contactUser = (req,res,next)=>{
    /**
     * @params : phNum  [형식은 xxx-xxxx-xxxx입니다.]
     */
    model.User.findAll(findUserParameter("phNum",req.body.phNum))
    .then(result=>{
        if(dataSizeZero(result)){ 
            doesNotresultDataOnly(res);
        }else{
            resultDataOnly(res,result);
        }
    })
    .catch(err=>{
        errMessage(res,err);
    })
}


exports.idContactUser = (req,res,next)=>{
    /**
     * @params : id [ userId ]
     * id를 통한 연락처 조회
     */
    model.User.findAll(findUserParameter("id",req.body.id))
    .then(result=>{
        if(dataSizeZero(result)){ 
            doesNotresultDataOnly(res);
        }else{
           resultDataOnly(res,result);
        }
    })
    .catch(err=>{
        errMessage(res,err);
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
            doesNotExists(res,"존재하지 않은 유저입니다.")
        }
        var token = makeJWT(data)
        res.json({
            success:true,
            accessToken:token,
            id:data.id
        })
    })
    .catch(err=>{
        errMessage(res,err)
    })
}


exports.makeTeam = async (req,res,next)=>{
    /**
     * @params : teamName
     */
    if(dataSizeZero(req.body.teamName)){
       await doesNotExists(res,"팀 이름을 적어주세요")
    }else{
        await model.Team.create(teamParameter(req))
        .then(result=>{
            responseSuccessAndId(res,result);
        })
        .catch(err=>{
            errMessage(res,err)
        })
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
        responseSuccessOnly(res,result[0])
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
           responseSuccessOnly(res,fin)
        })
        .catch(err=>{
            errMessageAddDetail(res,"해당되는 그룹이 존재하지 않습니다.")
        })
    })
    .catch(err=>{
        errMessageAddDetail(res,"해당되는 그룹이 존재하지 않습니다.")
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
    if(dataSizeZero(req.body)){ 
       doesNotExists(res,"멤버를 선택해주세요")
    }else{
      model.Team.findOne({
            where:{id:req.body[0].team_room}
        })
        .then(teamResult=>{
            if(dataSizeZero(teamResult)){
                doesNotExists(res,"제대로 된 그룹방이 아닙니다.")
            }
        })
        .then(async ()=>{
            await model.Accept.create(acceptParameter(req))
            await model.Member.bulkCreate(
                req.body,memberLimitAttribute()
               )
            .then(fin=>{
                successTrue(res)
            })
            .catch(err=>{
                errMessage(res,err)
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
    if(dataSizeZero(req.body)){
        doesNotExists(res,"요청된 값이 존재하지 않습니다.")
    }else{
        model.Friend.bulkCreate(req,friendLimitAttributes())
            .then(()=>{
                successTrue(res)
            })
            .catch((err)=>{
                errMessage(res,err)
            })
    }   
}


exports.getMyFriend = (req,res,next)=>{
    model.Friend.findAll(findFreindParameter(req))
    .then(result=>{
        resultDataOnly(res,result)
    })
    .catch(err=>{
        errMessage(res,err)
    })
}


exports.editUser = (req,res,next)=>{
    model.User.update({
                phNum:req.body.phNum,
                username:req.body.username
                },{
                where:{id:req.body.id}
            })
            .then(result=>{
               responseSuccessOnly(res,result[0])
            })
}


exports.deleteUser = (req,res,next)=>{
    model.User.destroy({
        where:{id:req.decoded.id||req.body.id}
    })
    .then(result=>{
       responseSuccessOnly(res,result[0])
    })
    .catch(err=>{
        errMessageAddDetail(res,'잘못된 정보입니다.')
    })
}

exports.deleteMember = (req,res,next)=>{
    model.Member.destroy({
        where:{team_member:req.body.userId,team_room:req.body.teamId}
    })
    .then(result=>{
        responseSuccessOnly(res,result)
    })
}

exports.getMember = (req,res,next)=>{
    /**
     * @params : team_room [team ID]
     */
    model.Member.findAll(findMemberParameter(req))
    .then(result=>{
        if(dataSizeZero(result)){
            doesNotExists(res,'잘못된 팀 정보입니다.')
        }else{
            resultDataOnly(res,result)
        }
    })
    .catch(err=>{
        errMessage(res,err)
    })
}

exports.getMyTeam = (req,res,next)=>{
    model.Member.findAll(findTeamParameter(req))
    .then(result=>{
        if(dataSizeZero(req.body.team_member)){
            res.status(NOT_FOUND).json({
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
        responseSuccessOnly(res,result[0])
    })
}

exports.testDelete = (req,res,next)=>{
    model.User.destroy({
        where:{phNum:req.body.phNum,username:req.body.username}
    })
    .then(result=>{
       responseSuccessOnly(res,result)
    })
}


/** ================function================= */

function isRightPhoneNumberLength(phNum){
    return phNum.length==13
}



function isNotMatchingLengthPhoneNumber(res){
    return res.status(BAD_REQUEST).json({
        success:false,
        data:"휴대전화 번호 길이가 다릅니다."
    });
}

function userParameter(req){
    return {
                phNum:req.body.phNum,
                username:req.body.username,
                token:req.body.token
        };
}

function makeUser(res,result){
    return res.status(CREATED).json({
        success:true,
        data:result
    });
}

function dataSizeZero(result){
    return result==null || result==undefined||result.length==0;
}

function doesNotresultDataOnly(res){
    return res.status(OK).json({
        message:"해당되는 연락처가 없습니다."
    });
}

function findUserParameter(key,value){
    let param={}
    let subParam={}

    subParam[key]=value

    param["attributes"]=["id","phNum","username"]
    param["where"]=subParam

    return param;
}

function resultDataOnly(res,result){
    return res.status(OK).json({
        data:result
    });
}

function errMessage(res,err){
    return res.status(INTERNAL_SERVER_ERROR).json({
        message:err
    });
}


function doesNotExists(res,msg){
    return res.status(BAD_REQUEST).send({
        success:false,
        message:msg
    })
}

function makeJWT(data){
    return jwt.sign( //jwt토큰 생성
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
}

function teamParameter(req){
    return {
        teamName:req.body.teamName,
        createdAt:new Date().getTime(),
        updatedAt:new Date().getTime()
    }
}

function responseSuccessAndId(res,result){
    return res.status(CREATED).json({
        success:true,
        id:result.id
    });
}

function responseSuccessOnly(res,result){
    var bool = isRight(result)
        res.json({
            success:bool
        })
}

function errMessageAddDetail(res,msg){
    return res.status(INTERNAL_SERVER_ERROR).json({
        success:false,
        message:msg
    })
}

function acceptParameter(req){
    return {
        total: Object.keys(req.body).length,
        teamId: req.body[0].team_room
    }
}

function memberLimitAttribute(){
    return  {
        returning:true,
        where:{team_member:{ne:null}}
    };
}

function successTrue(res){
    res.json({
        success:true
    })
}

function friendLimitAttributes(){
    return {returning:true,
        where:{
            myFriend:{ne:null}
    }};
}

function findFreindParameter(req){
    return {
        attributes:[],
        where:{device:req.decoded.id,hidden:false},
        include:[
                {model:model.User,as:'myFriendUser',attributes:["id","phNum","username"]}]
    };
}

function findMemberParameter(req){
    return {
        attributes:[],
        where:{team_room:req.query.team_room},
        include:[{model:model.User,as:'teamMember',attributes:['id','username','phNum']}],
    };
}

function findTeamParameter(req){
    return {
        attributes:[],
        where:{team_member:req.body.team_member},
        include:[{model:model.Team,as:'teamRoom',attributes:['id','teamName']}],
    };
}

function isRight(result){
    return result==1
}