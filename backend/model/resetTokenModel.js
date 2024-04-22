const { DataTypes } = require("sequelize");

const ResetTokens = (sequelize) => {
  return sequelize.define(
    "reset_tokens",
    {
      reset_token_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id_fk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      reset_token: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      reset_token_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      reset_token_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: "reset_tokens", // Specify the table name in your database
      timestamps: false,
    }
  );
};

module.exports = ResetTokens;
