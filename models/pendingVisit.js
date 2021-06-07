const { sequelize, Sequelize, User, Store } = require(".");
const setEventScheduler = "SET GLOBAL event_scheduler = ON"
const setEvent = 
"CREATE OR REPLACE EVENT delete_pending"
+" ON SCHEDULE EVERY 1 MINUTE"
+" ON COMPLETION PRESERVE"
+" DO"
+" DELETE FROM pendingVisits WHERE createdAt < (NOW() - INTERVAL 5 MINUTE)"


module.exports = (sequelize,DataTypes)=>{
    sequelize.query(setEventScheduler);
    sequelize.query(setEvent);
    return sequelize.define('pendingVisit',{
        phNum:{
            type: DataTypes.STRING
        }
    },{
        timestamps:true
    })
}