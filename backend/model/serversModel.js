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
      server_name: {
        type: DataTypes.STRING(60),
        validate: {
            len: [1, 60],
          },
      },
      account: {
        type: DataTypes.STRING(60),
        validate: {
            len: [1, 60],
          },
      },
      domain: {
        type: DataTypes.STRING(60),
        validate: {
            len: [1, 60],
          },
      }
    },
    {
      tableName: "servers",
      timestamps: false,
    }
  );
};

module.exports = Servers;
