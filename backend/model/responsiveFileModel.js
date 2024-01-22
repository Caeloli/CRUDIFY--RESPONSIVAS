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
      token: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: {
          len: [1, 30],
        },
      },
      user_name: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          len: [1, 80],
        },
      },
      email: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: [0, 20],
        },
      },
      immediately_chief: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          len: [1, 50],
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
      file_route: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: "responsive_files", // Specify the table name in your database
      timestamps: false,
    }
  );
};

module.exports = ResponsiveFiles;
