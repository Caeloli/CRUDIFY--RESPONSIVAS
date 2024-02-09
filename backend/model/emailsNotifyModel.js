const { DataTypes, Sequelize } = require("sequelize");

const EmailsNotify = (sequelize) => {
  return sequelize.define(
    "EmailsNotify",
    {
      email_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(100), // Adjust the length as needed
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "emails_notify", // Specify the table name in your database
      timestamps: false,
    }
  );
};

module.exports = EmailsNotify;
