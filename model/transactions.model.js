
const sequelize = require('sequelize');
var mariaConnection = require('../connection/login.connection');

//Model Schemaa for transactions Table
let Transactions = mariaConnection.define('transaction', {
    ID:{
            type: sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true
    },
    userName:sequelize.STRING,
    email:{
        type:sequelize.STRING,
        foreignKey:true
    },
    technology : sequelize.STRING,
    technologyCode :{
        type:sequelize.STRING, 
        foreignKey:true
    },
    totalQuestions : sequelize.INTEGER,
    marksSecured:sequelize.INTEGER,
    status:sequelize.STRING
}, {
        timestamps: false,
        freezeTableName: true, // Model tableName will be the same as the model name
        tableName: 'transaction'
    });

module.exports = {

    Transactions : Transactions

};