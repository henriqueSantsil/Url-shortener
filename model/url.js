const { DataTypes } = require("sequelize");
const db = require("../db/conn");

const URL = db.define('url', {
    url_origin: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    new_url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    validade: {
        type: DataTypes.TIME,
    },
})

module.exports = URL
