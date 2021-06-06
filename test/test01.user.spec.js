const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const expect = chai.expect;
chai.use(chaiHttp);
var userId=""


describe('사전에 서버 시동 ',()=>{
    it('시동 확인',()=>{
        return new Promise((resolve,reject)=>{
            chai.request(server)
            .get('/')
            .end((err,res)=>{
                resolve();
            })
        })
    })
    
})


describe('POST 데이터를 body에 넣어서 회원가입을 진행했을 때', ()=>{


    it('회원가입 요건에 따르지 않았을 때(휴대전화번호 길이가 다를때)',()=>{
        return new Promise((resolve,reject)=>{
            var params={
                phNum:'010-1234-56789',
                username:'errorman'
            }
            chai.request(server)
            .post('/api/user/signup')
            .send(params)
            .end((err,res)=>{
                expect(res).status(400)
                expect(res.body.success).to.equal(false)
                if(err) reject(new Error("Error message"))
                resolve();
                
            })
        })
    })//it

    it('제대로 회원가입에 준수했을 경우',()=>{
        return new Promise((resolve,reject)=>{
            var params={
                phNum:'010-1234-5678',
                username:"hong"
            }
        
            chai.request(server)
            .post('/api/user/signup')
            .send(params)
            .end((err,res)=>{
                expect(res).status(201)
                if(err) reject(new Error("Error message"))
                resolve();                
            })
        })
    })
    it('USER 111-2222-3333,init',()=>{
        return new Promise((resolve,reject)=>{
            var params = {
                phNum:'111-2222-3333',
                username:'init'
            }
            chai.request(server)
            .post('/api/user/signup')
            .send(params)
            .end((err,res)=>{
                userId=res.body.data.id
                if(err){
                    reject(new Error(err))
                }
                resolve();
            })

        })
    })
    it('회원 가입을 하는데 이미 해당 유저가 있는 경우',()=>{
        return new Promise((resolve,reject)=>{
            var params={
                phNum:'111-2222-3333',
                username:'init'
            }
            chai.request(server)
            .post('/api/user/signup')
            .send(params)
            .end((err,res)=>{
                expect(res).status(400)
                expect(res.body.success).to.equal(false)
                expect(res.body.message).to.equal("이미 존재하는 유저입니다")
                if(err){
                    reject(new Error(err))
                }
                resolve();
            })
        })
    })
})

describe('POST 로그인 절차를 시행할 경우', () => {

    it('해당 로그인이 성공했을 때',()=>{
        return new Promise((resolve,reject)=>{
            var params = {
                phNum: '010-1234-5678'
            }
            chai.request(server)
                .post('/api/user/login')
                .send(params)
                .end((err,res)=>{
                    expect(res).status(200)
                    expect(res.body.success).to.equal(true)
                    if(err){
                        reject(err)
                    }
                    resolve();
            
                })
            }) 
        })
    
    it('해당 유저가 존재하지 않을 경우',()=>{
        return new Promise((resolve,reject)=>{
            var params = {
                phNum: '999-8888-7777'
            }
            chai.request(server)
            .post('/api/user/login')
            .send(params)
            .end((err,res)=>{
                expect(res).status(400)
                expect(res.body.success).to.equal(false)
                expect(res.body.message).to.equal("존재하지 않은 유저입니다.")
                if(err){
                    reject(err)
                }
                resolve();
            })
        })
    })
    
})


describe('연락처 정보 휴대전화번호를 통해서 (contactUser)',()=>{
    it('연락처 조회를 성공적으로 했을 때',()=>{
        return new Promise((resolve,reject)=>{
            var params={
                phNum:['111-2222-3333','010-1234-5678']// 
            }
            chai.request(server)
                .post('/api/user/contact-user')
                .send(params)
                .end((err,res)=>{
                    expect(res).status(200)
                    expect(res.body).to.have.own.property('data')
                    if(err){
                        reject(new Error(err))
                    }
                    resolve()
                })
        })
    })

    it('해당 연락처의 정보가 데이터베이스에 없는 경우',()=>{
        return new Promise((resolve,reject)=>{
            var params={
                phNum:""
            }
            chai.request(server)
                .post('/api/user/contact-user')
                .send(params)
                .end((err,res)=>{
                    expect(res).status(200)
                    expect(res.body).to.have.own.property('message')
                    if(err){
                        reject(new Error(err))
                    }
                    resolve()
                })
        })
    })
})


describe('DELETE 회원탈퇴했을 때', () =>{
    it('성공적으로 회원탈퇴했을 때',()=>{
        return new Promise((resolve,reject)=>{
            var params = {
                phNum:'010-1234-5678',
                username:'hong'
            }
            chai.request(server)
            .del('/api/user/test/delete')
            .send(params)
            .end((err,res)=>{
                expect(res).status(200)
                expect(res.body.success).to.equal(true)
                if(err){
                    reject(new Error("회원 탈퇴가 제대로 이루어지지 않았습니다."))
                }
                resolve(res.body);
            })
        })
    })
})




describe('PUT 회원 유저 정보 수정',() => {
    it('성공적으로 회원정보수정을 했을 때',()=>{
        return new Promise((resolve,reject)=>{
            var params={
                id:userId,
                phNum:'111-2222-3333',
                username:'yaho'
            }
            chai.request(server)
            .put('/api/user/edit-info')
            .send(params)
            .end((err,res)=>{
                expect(res).status(200)
                expect(res.body.success).to.equal(true)
                if(err){
                    reject(err);
                }
                resolve();
            })
        })
    })
})