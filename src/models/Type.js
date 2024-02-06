const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Type', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es requerido.'
        },
        len: {
          args: [1, 20],
          msg: 'El nombre debe tener entre 1 y 20 caracteres.'
        }
      }
    },
  },
  {timestamps: false , freezeTableName: true}
  );
};