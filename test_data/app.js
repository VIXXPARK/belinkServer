const models = require("./models/index.js");
const makeUser = require('./routes/test_users');
const makeStores = require('./routes/test_stores');
const makeFriends = require('./routes/test_friends');


models.sequelize.sync().then( () => {
  console.log(" DB 연결 성공");

  makeUser();
  makeStores();
  makeFriends();
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
})