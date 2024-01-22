const { DataTypes } = require("sequelize");

const AuditLog = (sequelize) => {
  return sequelize.define(
    "AuditLog",
    {
      log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      resp_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "responsive_files",
          key: "resp_id",
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

      action_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "AuditLog",
          key: "action_id",
        },
        allowNull: false,
      },

      details: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },

      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        timezone: true,
      },

      additional_details: {
        type: DataTypes.JSONB,
        allowNull: false,
        defaultValue: {},
      },
    },
    {
      tableName: "audit_log",
      timestamps: false,
    }
  );
};

module.exports = AuditLog;
