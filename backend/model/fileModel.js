const { DataTypes } = require("sequelize");

const Files = (sequelize) => {
  return sequelize.define(
    "Files",
    {
      files_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      resp_id_fk: {
        type: DataTypes.INTEGER,
        references: {
          model: "responsiveFileModel",
          key: "resp_id",
        },
      },
      file_original_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            len: [1, 200],
          },
      },
      file_unique_name: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            len: [1, 200],
          },
      },
      file_content: {
        type: DataTypes.BLOB, 
        allowNull: false
      },
    },
    {
      tableName: "files", // Specify the table name in your database
      timestamps: false,
    }
  );
};

module.exports = Files;