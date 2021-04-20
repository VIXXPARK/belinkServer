const { resolve, reject } = require('bluebird');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const should = chai.should();
chai.use(chaiHttp);


describe('POST request on signup with data', ()=>{
    it('should status 201',async ()=>{
        const result = await getsSignup()
    })
    
})

async function getsSignup(){
    var params={
        phNum:'010-1234-5678',
        username:"홍길동"
    }

    chai.request(server)
    .post('/api/user/signup')
    .send(params)
    .end((err,res)=>{
        res.should.have.status(201)
        if(err) reject(err)
        resolve();
        
    })
}

describe('POST request on login with data', () => {
    it('should statsu 200',()=>{
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