const { DataTypes } = require("sequelize");

const AuthorizationAllow = (sequelize) => {
  return sequelize.define(
    "AuthorizationAllow",
    {
      allow_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      request_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "AuthorizationRequest",
          key: "request_id",
        },
        allowNull: false,
      },
      user_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
        allowNull: false,
      },
      is_allowed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "authorization_allow",
      timestamps: false,
    }
  );
};


module.exports = AuthorizationAllow;
