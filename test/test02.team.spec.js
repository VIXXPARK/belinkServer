const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../app");
const expect = chai.expect;
chai.use(chaiHttp);
var firstUserId = "";
var secondUserId = "";
var thirdUserId = "";
var teamId = "";

describe("TEST2 사전 필요한 회원가입", () => {
  it("USER 111-1111-1111,first", () => {
    return new Promise((resolve, reject) => {
      var params = {
        phNum: "111-1111-1111",
        username: "first",
      };
      chai
        .request(server)
        .post("/api/user/signup")
        .send(params)
        .end((err, res) => {
          firstUserId = res.body.data.id;
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
  it("USER 222-2222-2222,second", () => {
    return new Promise((resolve, reject) => {
      var params = {
        phNum: "222-2222-2222",
        username: "second",
      };
      chai
        .request(server)
        .post("/api/user/signup")
        .send(params)
        .end((err, res) => {
          secondUserId = res.body.data.id;
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
  it("USER 333-3333-3333,third", () => {
    return new Promise((resolve, reject) => {
      var params = {
        phNum: "333-3333-3333",
        username: "third",
      };
      chai
        .request(server)
        .post("/api/user/signup")
        .send(params)
        .end((err, res) => {
          thirdUserId = res.body.data.id;
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
  it("TEAM one", () => {
    return new Promise((resolve, reject) => {
      var params = {
        teamName: "one",
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
      chai
        .request(server)
        .post("/api/user/edit-team")
        .send(params)
        .end((err, res) => {
          teamId = res.body.id;
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
});

describe("POST 방 만들기", () => {
  it("방 만들기 성공했을 경우", () => {
    return new Promise((resolve, reject) => {
      var params = {
        teamName: "mike",
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
      chai
        .request(server)
        .post("/api/user/edit-team")
        .send(params)
        .end((err, res) => {
          expect(res).status(201);
          expect(res.body).to.have.own.property("id");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });

  it("POST 방 만들기 실패했을 경우(이름의 문자열 길이가 0일때)", () => {
    return new Promise((resolve, reject) => {
      var params = {
        teamName: "",
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime(),
      };
      chai
        .request(server)
        .post("/api/user/edit-team")
        .send(params)
        .end((err, res) => {
          expect(res).status(400);
          expect(res.body).to.have.own.property("message");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
});

describe("PUT 팀 이름을 수정했을 경우", () => {
  it("정상적으로 수정이 되었을 때", () => {
    return new Promise((resolve, reject) => {
      var params = {
        id: teamId,
        teamName: "edition",
      };
      chai
        .request(server)
        .put("/api/user/edit-team")
        .send(params)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body.success).to.equal(true);
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
});

describe("POST 팀 구성원 만들 때 (makeMember)", () => {
  it("정상적으로 팀 구성원이 있을 때", () => {
    return new Promise((resolve, reject) => {
      var params = [
        { team_room: teamId, team_member: firstUserId },
        { team_room: teamId, team_member: secondUserId },
        { team_room: teamId, team_member: thirdUserId },
      ];

      chai
        .request(server)
        .post("/api/user/make-member")
        .send(params)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body.success).to.equal(true);
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });

  it("POST 정상적으로 팀 구성원이 존재하지 않을 때", () => {
    return new Promise((resolve, reject) => {
      var params = [];
      chai
        .request(server)
        .post("/api/user/make-member")
        .send(params)
        .end((err, res) => {
          expect(res).status(400);
          expect(res.body.message).to.equal("멤버를 선택해주세요");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });

  //팀 방이 실제로 존재하는지 확인 할 것
  it("POST 그룹 아이디를 제대로 가져오지 못했을 때", () => {
    return new Promise((resolve, reject) => {
      var params = [
        { team_room: "", team_member: firstUserId },
        { team_room: "", team_member: secondUserId },
        { team_room: "", team_member: thirdUserId },
      ];
      chai
        .request(server)
        .post("/api/user/make-member")
        .send(params)
        .end((err, res) => {
          expect(res).status(400);
          expect(res.body).to.have.own.property("message");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });

  // 유저가 실제로 존재하는지 확인 할 것
  it("POST 유저 아이디를 제대로 가져오지 못했을 때 ", () => {
    return new Promise((resolve, reject) => {
      var params = [
        { team_room: teamId, team_member: "" },
        { team_room: teamId, team_member: secondUserId },
        { team_room: teamId, team_member: thirdUserId },
      ];
      chai
        .request(server)
        .post("/api/user/make-member")
        .send(params)
        .end((err, res) => {
          expect(res).status(500);
          expect(res.body).to.have.own.property("message");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
});

describe("POST 팀 구성원 누가 있나 확인!(getMember)", () => {
  it("정상적으로 찾았을 때", () => {
    return new Promise((resolve, reject) => {
      chai
        .request(server)
        .get("/api/user/get-member/")
        .query({ team_room: teamId })
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body).to.have.own.property("data");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });

  it("정상적으로 찾지 못했을 때", () => {
    return new Promise((resolve, reject) => {
      chai
        .request(server)
        .get("/api/user/get-member/")
        .query({ team_room: "" })
        .end((err, res) => {
          expect(res).status(400);

          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.own.property("message");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
});

describe("DELETE 팀에서 나가고 싶을 때", () => {
  it("정상적으로 삭제될 때", () => {
    return new Promise((resolve, reject) => {
      var params = {
        userId: firstUserId,
        teamId: teamId,
      };
      chai
        .request(server)
        .del("/api/user/edit-member")
        .send(params)
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body.success).to.equal(true);
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
});

describe("DELETE 그룹방 자체 삭제! (deleteTeam)", () => {
  it("정상적으로 삭제되었을 때", () => {
    return new Promise((resolve, reject) => {
      chai
        .request(server)
        .del("/api/user/delete-team")
        .query({ id: teamId })
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body.success).to.equal(true);
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
  it("query부분에 값이 전달 받지 않았을 때", () => {
    return new Promise((resolve, reject) => {
      chai
        .request(server)
        .del("/api/user/delete-team")
        .query()
        .end((err, res) => {
          expect(res).status(500);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.own.property("message");
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
  it("값이 제대로 오지 않았을 때", () => {
    return new Promise((resolve, reject) => {
      chai
        .request(server)
        .del("/api/user/delete-team")
        .query({ id: teamId })
        .end((err, res) => {
          expect(res).status(200);
          expect(res.body.success).to.equal(false);
          if (err) {
            reject(new Error(err));
          }
          resolve();
        });
    });
  });
});
