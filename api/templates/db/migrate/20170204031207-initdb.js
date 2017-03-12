'use strict'
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.sequelize.query(`
        CREATE TABLE users (
          id serial NOT NULL,
          password_hash text NOT NULL,
          phone text NOT NULL,
          "createdAt" timestamp with time zone,
          "updatedAt" timestamp with time zone
        );

        CREATE TABLE admins (
          id serial NOT NULL,
          name text,
          email text,
          phone text NOT NULL,
          password_hash text,
          role_id integer,
          "createdAt" timestamp with time zone,
          "updatedAt" timestamp with time zone
        );

        CREATE TABLE roles (
          id serial NOT NULL,
          name text,
          menus text[],
          "createdAt" timestamp with time zone,
          "updatedAt" timestamp with time zone
        );
    `)
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Users')
  }
}
