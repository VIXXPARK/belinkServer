const path = require('path');
const Sequelize = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'config.json'))[env];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.list = require('./list')(sequelize, Sequelize);
db.User=require('./user')(sequelize,Sequelize);
db.Group=require('./group')(sequelize,Sequelize);
db.Friend=require('./friend')(sequelize,Sequelize);
db.Store=require('./store')(sequelize,Sequelize);
db.Visit=require('./visit')(sequelize,Sequelize);
db.Member=require('./member')(sequelize,Sequelize);
//db.EntryNotice=require('./entryNotice')(sequelize,Sequelize);

db.User.hasMany(db.Visit)
db.Store.hasMany(db.Visit)

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

/*
db.EntryNotice.belongsTo(db.User,{
    foreignKey : {
        name : 'userId'
    }
});

db.EntryNotice.belongsTo(db.Store,{
    foreignKey : {
        name : 'storeId'
    }
});*/



db.Visit.belongsTo(db.User)
db.Visit.belongsTo(db.Store)

module.exports = db;
