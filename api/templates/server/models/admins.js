/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admins', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    phone: DataTypes.STRING,
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      }
    }
  }, {
    tableName: 'admins'
  });
};
