const { DataTypes, Sequelize } = require("sequelize");

const User = (sequelize) => {
  return sequelize.define(
    "User",
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(60), // Adjust the length as needed
        allowNull: false,
        unique: true,
      },
      //can only be 1 or 2
      user_type_id_fk: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "UserType",
          key: "user_type_id",
        },
      },
    },
    {
      tableName: "users", // Specify the table name in your database
      timestamps: false,
    }
  );
};

module.exports = User;
