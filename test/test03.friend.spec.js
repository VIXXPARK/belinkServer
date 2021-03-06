const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const expect = chai.expect;
const model = require("../models");
chai.use(chaiHttp);
var first = "";
var second = "";
var third = "";
var token = "";
describe("POST 친구를 만들 때", () => {
  it("유저 생성", async () => {
    await model.User.create({
      username: "host1",
      phNum: "010-2345-5000",
    }).then((res) => {
      first = res.id;
    });

    await model.User.create({
      username: "host2",
      phNum: "010-2345-6000",
    }).then((res) => {
      second = res.id;
    });

    await model.User.create({
      username: "host3",
      phNum: "010-2345-7000",
    }).then((res) => {
      third = res.id;
    });
  });

  it("정상적으로 친구맺기 성공했을 때", () => {
    return new Promise((resolve, reject) => {
      var params = [
        { device: first, myFriend: second },
        { device: first, myFriend: third },
      ];
      chai
        .request(server)
        .post("/api/user/edit-friend")
        .send(params)
        .end((err, res) => {
          if (err) {
            reject(new Error(err));
          }
          expect(res).status(200);
          expect(res.body.success).to.equal(true);
          resolve();
        });
    });
  });
});

describe("사전에 로그인 필수", () => {
  it("유저1 로그인 ", () => {
    return new Promise((resolve, reject) => {
      var params = {
        phNum: "010-2345-5000",
      };
      chai
        .request(server)
        .post("/api/user/login")
        .send(params)
        .end((err, res) => {
          if (err) {
            reject();
          }
          token = res.body.accessToken;
          resolve();
        });
    });
  });
});

describe("GET 친구정보 가져오기", () => {
  it(`성공했을 때`, () => {
    return new Promise((resolve, reject) => {
      chai
        .request(server)
        .get("/api/user/get-my-friend")
        .set({ "x-access-token": token })
        .end((err, res) => {
          if (err) {
            reject(new Error(err));
          }
          expect(res).status(200);
          resolve();
        });
    });
  });

  it("토큰이 제대로 존재하지 않았을 때", () => {
    return new Promise((resolve, reject) => {
      chai
        .request(server)
        .get("/api/user/get-my-friend")
        .end((err, res) => {
          if (err) {
            reject(new Error(err));
          }
          expect(res).status(403);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.have.own.property("message");
          resolve();
        });
    });
  });
});
