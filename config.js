require('dotenv').config()

const {Pool} = require('pg')
const isProduction = process.env.NODE_ENV === 'production'

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`

const db = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: !isProduction? false : {
    rejectUnauthorized: false
  }
})

const dbGray = new Pool({
  connectionString: isProduction ? process.env.HEROKU_POSTGRESQL_GRAY_URL : connectionString,
  ssl: !isProduction? false : {
    rejectUnauthorized: false
  }
})

module.exports = {db, dbGray}