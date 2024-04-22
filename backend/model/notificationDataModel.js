const { DataTypes } = require("sequelize");

const NotificationData = (sequelize) => {
  return sequelize.define(
    "notification_data",
    {
        notif_data_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
          bot_id: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: 'unique_bot_id'
          },
          chat_group_id: {
            type: DataTypes.STRING(100),
            allowNull: false
          },
          notification_time: {
            type: DataTypes.TIME,
            allowNull: false
          }
    },
    {
      tableName: "notification_data", // Specify the table name in your database
      timestamps: false,
    }
  );
};

module.exports = NotificationData;