const server = require("../app");
const model = require("../models");
const chai = require("chai");
const chaiHttp = require("chai-http");
const { expect } = require("chai");
chai.use(chaiHttp);

describe("사전에 서버 시동 ", () => {
    it("시동 확인", () => {
      return new Promise((resolve, reject) => {
        chai
          .request(server)
          .get("/")
          .end((err, res) => {
            resolve();
          });
      });
    });
  });


describe("Create test tuple for pending Visit", () => {
    it("Create test tuple for store", () => {
        return new Promise((resolve, reject) => {
            model.Store.create({
                id: "50787790",
                storeName: "스타벅스 잠실시그마타워점",
                storeLocation:"서울 송파구 올림픽로 289",
                storeType:"CE7",
                companyNum:"test04_test",
                token:"test04_test",
                createdAt: new Date(),
                updatedAt: new Date()
            }).then(()=>{
                resolve();
            }).catch(err=>{
                reject()
            })
        })
    })

    it("Create test tuple for user", () => {
        return new Promise((resolve, reject) => {
             model.User.create({
                id: "dafff0d2-7298-4768-b7ae-4c1b7d2b7cdb",
                phNum: "010-1801-1663",
                username: "test04_user",
                active: "1",
                admin: "0",
                infect: "0",
                token: "test04_token",
                createdAt: new Date(),
                updatedAt: new Date()
            }).then(() => {
                resolve();
            }).catch(err => {
                if(err == 'SequelizeUniqueConstraintError: Validation error')
                    resolve();
                else
                    reject(err);
            })
        })
    })
});

describe("Send Pending Visit", () => {
    it("Request sent w/o User", () => {
        return new Promise((resolve, reject) => {
            var body = {
                storeId: "50787790"
            };
            chai.request(server)
            .post('/api/location/pendingVisits')
            .send(body)
            .end((err, res) => {
                if(err)
                    reject();
                expect(res).status(400);
                resolve();
            })
        })
    })

    it("Request sent w/o Store", () => {
        return new Promise((resolve, reject) => {
            var body = {
                userId: "dafff0d2-7298-4768-b7ae-4c1b7d2b7cdb"
            };
            chai.request(server)
            .post('/api/location/pendingVisits')
            .send(body)
            .end((err, res) => {
                if(err)
                    reject();
                expect(res).status(400);
                resolve();
            })
        })
    })

    it("Request sent w/o valid User", () => {
        return new Promise((resolve, reject) => {
            var body = {
                storeId: "50787790",
                userId: "Invaild_User"
            };
            chai.request(server)
            .post('/api/location/pendingVisits')
            .send(body)
            .end((err, res) => {
                if(err)
                    reject();
                expect(res).status(400);
                resolve();
            })
        })
    })

    it("Successful Request", () => {
        return new Promise((resolve, reject) => {
            var body = {
                storeId: "50787790",
                userId: "dafff0d2-7298-4768-b7ae-4c1b7d2b7cdb"
            };
            chai.request(server)
            .post('/api/location/pendingVisits')
            .send(body)
            .end((err, res) => {
                if(err)
                    reject();
                expect(res).status(200);
                resolve();
            })
        })
    })
});

describe("Store Pending Check", () => {
    it("get-pending w/o storeId", () => {
        return new Promise((resolve, reject) => {
            var body = {
            }
            chai.request(server)
                .post("/api/store/get-pending")
                .send(body)
                .end((err, res) => {
                    if(err)
                        reject();
                    expect(res).status(400);
                    resolve();
                })
        })
    })

    it("get-pending w/o valid storeId", () => {
        return new Promise((resolve, reject) => {
            var body = {
                storeId: "Invaild_storeId"
            }
            chai.request(server)
                .post("/api/store/get-pending")
                .send(body)
                .end((err, res) => {
                    if(err)
                        reject();
                    expect(res).status(400);
                    resolve();
                })
        })
    })

    it("Successful get-pending", () => {
        return new Promise((resolve, reject) => {
            var body = {
                storeId: "50787790"
            }
            chai.request(server)
                .post("/api/store/get-pending")
                .send(body)
                .end((err, res) => {
                    if(err)
                        reject();
                    expect(res).status(200);
                    resolve();
                })
        })
    })

    it("accept-pending w/o all params", () => {
        return new Promise((resolve, reject) => {
            var body = {
                userId: "dafff0d2-7298-4768-b7ae-4c1b7d2b7cdb",
                storeId: "50787790",
                createdAt: "2021-06-07T07:50:01.000Z",
                updatedAt: "2021-06-07T07:50:01.000Z"
            }
            chai.request(server)
                .post("/api/store/accept-pending")
                .send(body)
                .end((err, res) => {
                    if(err)
                        reject();
                    expect(res).status(400);
                    resolve();
                })
        })
    })

    it("Successful accept-pending", () => {
        return new Promise((resolve, reject) => {
            var body = {
                id: "4",
                userId: "dafff0d2-7298-4768-b7ae-4c1b7d2b7cdb",
                storeId: "50787790",
                createdAt: "2021-06-07T07:50:01.000Z",
                updatedAt: "2021-06-07T07:50:01.000Z"
            }
            chai.request(server)
                .post("/api/store/accept-pending")
                .send(body)
                .end((err, res) => {
                    if(err)
                        reject();
                    expect(res).status(200);
                    resolve();
                })
        })
    })

    it("reject-pending w/o all params", () => {
        return new Promise((resolve, reject) => {
            var body = {
            }
            chai.request(server)
                .post("/api/store/reject-pending")
                .send(body)
                .end((err, res) => {
                    if(err)
                        reject();
                    expect(res).status(400);
                    resolve();
                })
        })
    })

    it("Successful reject-pending", () => {
        return new Promise((resolve, reject) => {
            var body = {
                id: "4"
            }
            chai.request(server)
                .post("/api/store/reject-pending")
                .send(body)
                .end((err, res) => {
                    if(err)
                        reject();
                    expect(res).status(200);
                    resolve();
                })
        })
    })
});