const { DataTypes } = require("sequelize");

const States = (sequelize) => {
  return sequelize.define(
    "States",
    {
      state_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      state_name: {
        type: DataTypes.STRING(10), // Adjust the length as needed
        allowNull: false,
      },
    },
    {
      tableName: "states",
      timestamps: false,
    }
  );
};

module.exports = States;
