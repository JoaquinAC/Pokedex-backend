const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('Pokemon', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'El nombre es requerido.'
        },
        len: {
          args: [1, 15],
          msg: 'El nombre debe tener entre 1 y 15 caracteres.'
        }
      }
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: {
          msg: 'La imagen debe ser una URL válida.'
        }
      }
    },
    hp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Los puntos de salud deben ser un número entero.'
        },
        min: {
          args: [0],
          msg: 'Los puntos de salud deben ser igual o mayor a 0.'
        }
      }
    },
    attack: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El valor de ataque debe ser un número entero.'
        },
        min: {
          args: [0],
          msg: 'El valor de ataque debe ser igual o mayor a 0.'
        }
      }
    },
    defense: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'El valor de defensa debe ser un número entero.'
        },
        min: {
          args: [0],
          msg: 'El valor de defensa debe ser igual o mayor a 0.'
        }
      }
    },
    speed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isInt: {
          msg: 'La velocidad debe ser un número entero.'
        },
        min: {
          args: [0],
          msg: 'La velocidad debe ser igual o mayor a 0.'
        }
      }
    },
    height: {
      type: DataTypes.FLOAT,
      allowNull: true,
      validate: {
        isFloat: {  
          msg: 'La altura debe ser un número decimal.'
        },
        min: {
          args: [0],
          msg: 'La altura debe ser igual o mayor a 0.'
        }
      }
    },
    weight: {
      type: DataTypes.FLOAT, 
      allowNull: true,
      validate: {
        isFloat: {  
          msg: 'El peso debe ser un número decimal.'
        },
        min: {
          args: [0],
          msg: 'El peso debe ser igual o mayor a 0.'
        }
      }
    },
  },
  {timestamps: false , freezeTableName: true}
  );
};