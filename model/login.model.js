
const sequelize = require('sequelize');
var mariaConnection = require('../connection/login.connection');

//Model Schemaa for Employee Table
let Login = mariaConnection.define('users', {
    email: { 
        type: sequelize.STRING, 
         primaryKey: true 
    },
    userName:sequelize.STRING,
    password: sequelize.STRING,
    city:sequelize.STRING,
    state:sequelize.STRING,
    country:sequelize.STRING,
    phoneNo:sequelize.STRING,
    qualification:sequelize.STRING,
    loginAttempts:sequelize.INTEGER,
    status:sequelize.STRING,
    createdOn:sequelize.DATE,
    createdBy:sequelize.STRING,
    modifiedOn:sequelize.DATE,
    modifiedBy:sequelize.STRING,
    isDeleted :sequelize.INTEGER
}, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
        tableName: 'users'
    });

module.exports = {

    Login: Login

};