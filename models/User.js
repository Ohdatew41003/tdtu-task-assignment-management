const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM(
      'truong_khoa',
      'pho_khoa',
      'truong_bo_mon',
      'dau_moi_cong_viec'
    ),
    allowNull: false
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: []
  }
});

module.exports = User;