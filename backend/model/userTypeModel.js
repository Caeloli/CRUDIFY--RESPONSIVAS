const { DataTypes } = require("sequelize");

const UserType = (sequelize) => {
  return sequelize.define(
    "UserType",
    {
      user_type_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_type: {
        type: DataTypes.STRING(10), // Adjust the length as needed
        allowNull: false,
      },
    },
    {
      tableName: "user_type",
      timestamps: false,
    }
  );
};

module.exports = UserType;
