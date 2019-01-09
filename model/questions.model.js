
const sequelize = require('sequelize');
var mariaConnection = require('../connection/login.connection');

//Model Schemaa for Employee Table
let Questions = mariaConnection.define('certification', {
    technology : sequelize.STRING,
    technologyCode : { 
        type: sequelize.STRING, 
         primaryKey: true 
    },
    questions : sequelize.BLOB
}, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
        tableName: 'certification'
    });

module.exports = {

    Questions: Questions

};