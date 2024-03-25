const { DataTypes } = require("sequelize");

const ResponsiveFiles = (sequelize) => {
  return sequelize.define(
    "ResponsiveFiles",
    {
      resp_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "user_id",
        },
      },
      user_servers_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "users_servers",
          key: "user_server_id",
        },
      },
      state_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "states",
          key: "state_id",
        },
      },
      remedy: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        timezone: true,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn(
          "DATEADD",
          sequelize.literal("day"),
          365,
          sequelize.fn("NOW")
        ),
        timezone: true,
      },
      file_format: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      before_resp_id_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      after_resp_id_fk: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      }
    },
    {
      tableName: "responsive_files", // Specify the table name in your database
      timestamps: false,
    }
  );
};

module.exports = ResponsiveFiles;
