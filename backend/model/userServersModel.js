const { DataTypes } = require("sequelize");

const UserServers = (sequelize) => {
  return sequelize.define(
    "UserServers",
    {
      user_server_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_server_username: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      immediately_chief: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      immediately_chief_email: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
    },
    {
      tableName: "users_servers",
      timestamps: false,
    }
  );
};

module.exports = UserServers;
