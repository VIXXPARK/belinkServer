const model = require("../../../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env;

const BAD_REQUEST = 400;
const OK = 200;
const INTERNAL_SERVER_ERROR = 500;
const CREATED = 201;
const PHONE_LENGTH = 13;
const TRUE = 1;

exports.register = (req, res) => {
  /**
   * @params : phNum
   * @params : username
   * @params : token(기기 고유한 번호)
   */
  model.User.findOne({ where: { phNum: req.body.phNum } }).then((data) => {
    if (isDataSizeZero(data) == false) {
      doesNotExistsResponse(res, "이미 존재하는 유저입니다");
    } else if (!isRightPhoneNumberLength(req.body.phNum)) {
      // XXX-XXXX-XXXX 형식으로 저장
      isNotMatchingLengthPhoneNumberResponse(res);
    } else {
      model.User.create(phoneNumberAndUsernameAndToken(req)).then((result) => {
        successAndDataResponse(res, result);
      });
    }
  });
};

exports.contactUser = (req, res, next) => {
  /**
   * @params : phNum  [형식은 xxx-xxxx-xxxx입니다.]
   */
  model.User.findAll(findUserBy_("phNum", req.body.phNum))
    .then((result) => {
      if (isDataSizeZero(result)) {
        doesNotHaveContactResponse(res);
      } else {
        resultDataResponse(res, result);
      }
    })
    .catch((err) => {
      errMessage(res, err);
    });
};

exports.idContactUser = (req, res, next) => {
  /**
   * @params : id [ userId ]
   */
  model.User.findAll(findUserBy_("id", req.body.id))
    .then((result) => {
      if (isDataSizeZero(result)) {
        doesNotHaveContactResponse(res);
      } else {
        resultDataResponse(res, result);
      }
    })
    .catch((err) => {
      errMessage(res, err);
    });
};

exports.login = (req, res, next) => {
  /**
   * @params : phNum
   */
  model.User.findOne(limitPhoneNumberAttribute(req))
    .then((data) => {
      if (!data) {
        doesNotExistsResponse(res, "존재하지 않은 유저입니다.");
      }
      var token = makeJWT(data);
      loginSuccessTokenIdResponse(res, data, token);
    })
    .catch((err) => {
      errMessage(res, err);
    });
};

exports.refreshToken = (req, res, next) => {
  /**
   * @params  : phNum {String}
   */
  model.User.update(
    phoneNumberAndUsernameAndToken(req),
    limitPhoneNumberAttribute(req)
  ).then((result) => {
    compareWithResultResponse(res, result[0]);
  });
};

exports.makeTeam = async (req, res, next) => {
  /**
   * @params : teamName
   */
  if (isDataSizeZero(req.body.teamName)) {
    await doesNotExistsResponse(res, "팀 이름을 적어주세요");
  } else {
    await model.Team.create(insertTeamName(req))
      .then((result) => {
        responseSuccessAndId(res, result);
      })
      .catch((err) => {
        errMessage(res, err);
      });
  }
};

exports.editTeam = (req, res, next) => {
  /**
   * @params : teamName
   * @params : id [team ID]
   */
  model.Team.update(
    { teamName: req.body.teamName },
    limitIdAttribute(req)
  ).then((result) => {
    compareWithResultResponse(res, result[0]);
  });
};

exports.deleteTeam = (req, res, next) => {
  model.Member.destroy({
    where: { team_room: req.query.id },
  })
    .then((result) => {
      model.Team.destroy({
        where: { id: req.query.id },
      })
        .then((fin) => {
          compareWithResultResponse(res, fin);
        })
        .catch((err) => {
          errMessageAddDetail(res, "해당되는 그룹이 존재하지 않습니다.");
        });
    })
    .catch((err) => {
      errMessageAddDetail(res, "해당되는 그룹이 존재하지 않습니다.");
    });
};

exports.makeMember = (req, res, next) => {
  /**
   * @body
   *          @params  team_room:"asfdads-dfasdfa-dsafsf",
   *          @params  team_member:"wrwer-bsdfb-qwfwev2"
   */
  if (isDataSizeZero(req.body)) {
    doesNotExistsResponse(res, "멤버를 선택해주세요");
  } else {
    model.Team.findOne({
      where: { id: req.body[0].team_room },
    })
      .then((teamResult) => {
        if (isDataSizeZero(teamResult)) {
          doesNotExistsResponse(res, "제대로 된 그룹방이 아닙니다.");
        }
      })
      .then(async () => {
        await model.Accept.create(totalAndTeamId(req));
        await model.Member.bulkCreate(req.body, memberLimitAttribute())
          .then((fin) => {
            successTrueResponse(res);
          })
          .catch((err) => {
            errMessage(res, err);
          });
      });
  }
};

exports.makeFriend = (req, res, next) => {
  /**
   * @body
   *      @params          device:-----,
   *      @params          myFriend:----,
   */
  if (isDataSizeZero(req.body)) {
    doesNotExistsResponse(res, "요청된 값이 존재하지 않습니다.");
  } else {
    model.Friend.bulkCreate(req, friendLimitAttributes())
      .then(() => {
        successTrueResponse(res);
      })
      .catch((err) => {
        errMessage(res, err);
      });
  }
};

exports.getMyFriend = (req, res, next) => {
  model.Friend.findAll(findByDeviceAndHidden(req))
    .then((result) => {
      resultDataResponse(res, result);
    })
    .catch((err) => {
      errMessage(res, err);
    });
};

exports.editUser = (req, res, next) => {
  model.User.update(
    phoneNumberAndUsernameAndToken(req),
    limitIdAttribute(req)
  ).then((result) => {
    compareWithResultResponse(res, result[0]);
  });
};

exports.deleteUser = (req, res, next) => {
  model.User.destroy({
    where: { id: req.decoded.id || req.body.id },
  })
    .then((result) => {
      compareWithResultResponse(res, result[0]);
    })
    .catch((err) => {
      errMessageAddDetail(res, "잘못된 정보입니다.");
    });
};

exports.deleteMember = (req, res, next) => {
  model.Member.destroy(deleteByTeamMemberAndTeamRoom(req)).then((result) => {
    compareWithResultResponse(res, result);
  });
};

exports.getMember = (req, res, next) => {
  /**
   * @params : team_room [team ID]
   */
  model.Member.findAll(findByTeamroom(req))
    .then((result) => {
      if (isDataSizeZero(result)) {
        doesNotExistsResponse(res, "잘못된 팀 정보입니다.");
      } else {
        resultDataResponse(res, result);
      }
    })
    .catch((err) => {
      errMessage(res, err);
    });
};

exports.getMyTeam = (req, res, next) => {
  model.Member.findAll(findByTeamMember(req)).then((result) => {
    if (isDataSizeZero(req.body.team_member)) {
      doesNotExistsResponse(res, "id가 없습니다.");
    } else {
      findTeamResponse(res, result);
    }
  });
};

exports.infectUser = (req, res, next) => {
  model.User.update(updateFromInfectById(req)).then((result) => {
    compareWithResultResponse(res, result[0]);
  });
};

exports.testDelete = (req, res, next) => {
  model.User.destroy({
    where: phoneNumberAndUsername(req),
  }).then((result) => {
    compareWithResultResponse(res, result);
  });
};

/** ================function================= */

function isRightPhoneNumberLength(phNum) {
  return phNum.length == PHONE_LENGTH;
}

function isNotMatchingLengthPhoneNumberResponse(res) {
  return res.status(BAD_REQUEST).json({
    success: false,
    data: "휴대전화 번호 길이가 다릅니다.",
  });
}

function phoneNumberAndUsernameAndToken(req) {
  return {
    phNum: req.body.phNum,
    username: req.body.username,
    token: req.body.token,
  };
}

function limitPhoneNumberAttribute(req) {
  return { where: { phNum: req.body.phNum } };
}

function successAndDataResponse(res, result) {
  return res.status(CREATED).json({
    success: true,
    data: result,
  });
}

function isDataSizeZero(result) {
  return result == null || result == undefined || result.length == 0;
}

function doesNotHaveContactResponse(res) {
  return res.status(OK).json({
    message: "해당되는 연락처가 없습니다.",
  });
}

function findUserBy_(key, value) {
  let param = {};
  let subParam = {};

  subParam[key] = value;

  param["attributes"] = ["id", "phNum", "username"];
  param["where"] = subParam;

  return param;
}

function resultDataResponse(res, result) {
  return res.status(OK).json({
    data: result,
  });
}

function errMessage(res, err) {
  return res.status(INTERNAL_SERVER_ERROR).json({
    message: err,
  });
}

function loginSuccessTokenIdResponse(res, data, token) {
  return res.json({
    success: true,
    accessToken: token,
    id: data.id,
  });
}

function doesNotExistsResponse(res, msg) {
  return res.status(BAD_REQUEST).send({
    success: false,
    message: msg,
  });
}

function makeJWT(data) {
  return jwt.sign(
    //jwt토큰 생성
    JWTPayload(data),
    env.JWT_SECRET_KEY,
    JWTPayloadTail()
  );
}

function JWTPayload(data) {
  return {
    id: data.id,
    username: data.username,
    phNum: data.phNum,
    active: data.active,
  };
}

function JWTPayloadTail() {
  return {
    expiresIn: "30d",
    issuer: "belink",
    subject: "userInfo",
  };
}

function insertTeamName(req) {
  return {
    teamName: req.body.teamName,
    createdAt: new Date().getTime(),
    updatedAt: new Date().getTime(),
  };
}

function responseSuccessAndId(res, result) {
  return res.status(CREATED).json({
    success: true,
    id: result.id,
  });
}

function limitIdAttribute(req) {
  return {
    where: { id: req.body.id },
  };
}

function phoneNumberAndUsername(req) {
  return {
    phNum: req.body.phNum,
    username: req.body.username,
  };
}

function compareWithResultResponse(res, result) {
  var bool = isRight(result);
  res.json({
    success: bool,
  });
}

function errMessageAddDetail(res, msg) {
  return res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: msg,
  });
}

function totalAndTeamId(req) {
  return {
    total: Object.keys(req.body).length,
    teamId: req.body[0].team_room,
  };
}

function memberLimitAttribute() {
  return {
    returning: true,
    where: { team_member: { ne: null } },
  };
}

function successTrueResponse(res) {
  res.json({
    success: true,
  });
}

function friendLimitAttributes() {
  return {
    returning: true,
    where: {
      myFriend: { ne: null },
    },
  };
}

function findByDeviceAndHidden(req) {
  return {
    attributes: [],
    where: { device: req.decoded.id, hidden: false },
    include: [
      {
        model: model.User,
        as: "myFriendUser",
        attributes: ["id", "phNum", "username"],
      },
    ],
  };
}

function findByTeamroom(req) {
  return {
    attributes: [],
    where: { team_room: req.query.team_room },
    include: [
      {
        model: model.User,
        as: "teamMember",
        attributes: ["id", "username", "phNum"],
      },
    ],
  };
}

function deleteByTeamMemberAndTeamRoom(req) {
  return {
    where: { team_member: req.body.userId, team_room: req.body.teamId },
  };
}

function findByTeamMember(req) {
  return {
    attributes: [],
    where: { team_member: req.body.team_member },
    include: [
      { model: model.Team, as: "teamRoom", attributes: ["id", "teamName"] },
    ],
  };
}

function findTeamResponse(res, result) {
  return res.json({
    result,
  });
}

function updateFromInfectById(req) {
  return (
    {
      infect: req.body.infect,
    },
    { where: { id: req.body.id } }
  );
}

function isRight(result) {
  return result == TRUE;
}
