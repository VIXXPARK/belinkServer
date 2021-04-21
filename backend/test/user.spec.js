const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
chai.use(chaiHttp);


beforeEach(async ()=>{
    //데이터베이스 초기화
})


describe('POST 데이터를 body에 넣어서 회원가입을 진행했을 때', ()=>{
    it('제대로 회원가입에 준수했을 경우',()=>{
        return new Promise((resolve,reject)=>{
            var params={
                phNum:'010-1234-5678',
                username:"홍길동"
            }
        
            chai.request(server)
            .post('/api/user/signup')
            .send(params)
            .end((err,res)=>{
                res.should.have.status(201)
                if(err) reject(new Error("Error message"))
                resolve();
                
            })
        })
    })
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
                res.should.have.status(400)
                res.body.success.should.false;
                if(err) reject(new Error("Error message"))
                resolve();
                
            })
        })
    })
})

describe('POST request on login with data', () => {
    it('should statsu 200',()=>{
        return new Promise((resolve,reject)=>{
            var params = {
                phNum: '010-1234-5678'
            }
            chai.request(server)
                .post('/api/user/login')
                .send(params)
                .end((err,res)=>{
                    res.should.have.status(200)
                    res.body.success.should.be.ok
                    if(err){
                        reject(err)
                    }
                    resolve();
            
                })
            }) 
        })
})

describe('DELETE request on sign out with data', () =>{
    it('should status 200',()=>{
        return new Promise((resolve,reject)=>{
            var params = {
                phNum:'010-1234-5678',
                username:'홍길동'
            }
            chai.request(server)
            .del('/api/user/test/delete')
            .send(params)
            .end((err,res)=>{
                res.should.have.status(200)
                res.body.success.should.be.ok
                if(err){
                    reject(new Error("회원 탈퇴가 제대로 이루어지지 않았습니다."))
                }
                resolve(res.body);
            })
        })
    })
})