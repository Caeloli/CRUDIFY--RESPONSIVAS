const { DataTypes } = require("sequelize");

const Actions = (sequelize) => {
  return sequelize.define(
    "Actions",
    {
      action_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      description: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      tableName: "actions",
      timestamps: false,
    }
  );
};

module.exports = Actions;
