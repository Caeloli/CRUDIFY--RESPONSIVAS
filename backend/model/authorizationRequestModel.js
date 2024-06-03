const { DataTypes, DATE } = require("sequelize");

const AuthorizationRequest = (sequelize) => {
  return sequelize.define(
    "AuthorizationRequest",
    {
      request_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        is_allowed: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
        },
      },
      user_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
        allowNull: false,
      },
      action_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "actions",
          key: "action_id",
        },
        allowNull: false,
      },
      request_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      affected_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      affected_email: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          len: [0, 50],
        },
      },
      affected_name: {
        type: DataTypes.STRING(90),
        allowNull: true,
        validate: {
          len: [0, 90],
        },
      },
      affected_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      chat_id: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
    },
    {
      tableName: "authorization_request",
      timestamps: false,
    }
  );
};

module.exports = AuthorizationRequest;
