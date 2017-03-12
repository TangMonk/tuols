'use strict'
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('users', {
    phone: DataTypes.STRING,
    password_hash: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    instanceMethods: {
      toJSON: function () {
        var values = Object.assign({}, this.get())

        delete values.password_hash
        return values
      }
    },
    tableName: 'users'
  })
  return User
}
