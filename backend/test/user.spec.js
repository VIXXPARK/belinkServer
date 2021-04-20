const { resolve } = require("bluebird");
const should = require("should");
const request = require('supertest');
const app = require('../app');

describe('GET /test', function(){
    it('should return 200 status code ',()=>{
        request(app)
        .get('api/user/test')
        .expect(304)
        .end((err,res)=>{
            if(err) throw err
            resolve("success")
        })
    })
    
})