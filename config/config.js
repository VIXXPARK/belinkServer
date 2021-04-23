require('dotenv').config();
const env = process.env;
const development = {
    username: env.MYSQL_USERNAME,
    password: env.MYSQL__PASSWORD,
    database: env.MYSQL_DATABASE,
    host: env.MYSQL_HOST,
    dialect:env.MYSQL_DIALECT,
    dialectOptions:{
        multipleStatments:true
      }
}

const production = {
    username: env.MYSQL_SERVER_USERNAME,
    password: env.MYSQL_SERVER_PASSWORD,
    database: env.MYSQL_SERVER_DATABASE,
    host: env.MYSQL_SERVER_HOST,
    dialect:env.MYSQL_DIALECT,
    dialectOptions:{
        multipleStatments:true
      },
    ssl:true
}

const test = {
    user: env.MYSQL_USERNAME,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE_TEST,
    host: env.MYSQL_HOST,
    dialect:env.MYSQL_DIALECT,
    dialectOptions:{
        multipleStatments:true
      }
}

module.exports = {development,test,production};