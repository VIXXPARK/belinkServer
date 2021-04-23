const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.js'))[env];
const db = {};
if(config.username=='root'){
    console.log("여기에 들어옴")
    config.password=null
}
const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.Sequelize = Sequelize;



db.User=require('./user')(sequelize,Sequelize);
db.Team=require('./team')(sequelize,Sequelize);
db.Friend=require('./friend')(sequelize,Sequelize);
db.Store=require('./store')(sequelize,Sequelize);
db.Visit=require('./visit')(sequelize,Sequelize);
db.Member=require('./member')(sequelize,Sequelize);

db.User.hasMany(db.Visit)
db.Store.hasMany(db.Visit)


db.User.hasMany(db.Member,{
    as:'teamMember',
    foreignKey:{
        name:'team_member',
    }
})

db.Team.hasMany(db.Member,{
    as:'teamRoom',
    foreignKey:{
        name:'team_room'
    }
})

db.Member.belongsTo(db.User,{
    as:'teamMember',
    foreignKey:{
        name:'team_member',
        allowNull:false
    }
})

db.Member.belongsTo(db.Team,{
    as:'teamRoom',
    foreignKey:{
        name:'team_room',
        allowNull:false
    }
})


db.User.hasMany(db.Friend,{
    as:'deviceUser',
    foreignKey:{
        name:'device'
    }
    })
db.User.hasMany(db.Friend,{
    as:'myFriendUser',
    foreignKey:{
        name:'myFriend'
    }
})

db.Friend.belongsTo(db.User,{
    as:'deviceUser',
    foreignKey:{
        name:'device',
        allowNull:false
    }
})

db.Friend.belongsTo(db.User,{
    as:'myFriendUser',
    foreignKey:{
        name:'myFriend',
        allowNull:false
    }
})

db.Visit.belongsTo(db.User)

db.Visit.belongsTo(db.Store)

module.exports = db;
