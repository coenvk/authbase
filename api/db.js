"use strict";
const config = require('./config');
const mysql = require('mysql');

class Db {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 21,
      host: config.db_host,
      user: config.db_user,
      password: config.db_passwd,
      database: config.db,
      dateStrings: true,
      multipleStatements: true
    });
  }

  query(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, args, (error, result, fields) => {
        if (error) {
          console.log('--- db.QUERY-ERROR ---')
          console.log('ERROR: ' + error)
          return reject(error);
        }
        console.log('--- db.QUERY ---')
        console.log('SQL: ' + sql)
        console.log('ARGS: ' + JSON.stringify(args))
        console.log('RESULT: ' + JSON.stringify(result[0]))
        console.log('FIELDS: ' + JSON.stringify(fields))
        resolve(result[0]);
      })
    })
  }

  insert(sql, args) {
    return new Promise((resolve, reject) => {
      this.pool.query(sql, args, (error, result, fields) => {
        if (error) {
          console.log('--- db.QUERY-ERROR ---')
          console.log('ERROR: ' + error)
          return reject(error);
        }
        console.log('--- db.INSERT ---')
        console.log('SQL: ' + sql)
        console.log('ARGS: ' + JSON.stringify(args))
        console.log('RESULT: ' + JSON.stringify(result))
        console.log('FIELDS: ' + JSON.stringify(fields))
        resolve(result);
      })
    })
  }

  getAllUsers() {
    return this.query(`CALL getUsers();`);
  }

  selectUserByEmail(email) {
    return this.query(`CALL getActivatedUserByEmail(?);`, [email]);
  }

  insertUser(user) {
    return this.insert(`CALL insertUser(?, ?, ?, ?);`, user);
  }

}

module.exports = Db
