const { DataTypes } = require("sequelize");

const Servers = (sequelize) => {
  return sequelize.define(
    "Servers",
    {
      server_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      responsive_file_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "responsive_files",
          key: "resp_id",
        },
      },
      brand: {
        type: DataTypes.STRING(255),
      },
      model: {
        type: DataTypes.STRING(255),
      },
      serial_number: {
        type: DataTypes.STRING(255),
      },
      location: {
        type: DataTypes.STRING(255),
      },
      hostname: {
        type: DataTypes.STRING(255),
      },
      ip_address: {
        type: DataTypes.STRING(255),
      },
      domain_server: {
        type: DataTypes.ENUM("pemex", "un"),
      },
    },
    {
      tableName: "servers",
      timestamps: false,
    }
  );
};

module.exports = Servers;
