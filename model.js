import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize('sqlite::memory:');

const User = sequelize.define(
  'User',
  {
    // Model attributes are defined here
    abdul: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rehman: {
      type: DataTypes.STRING,
      // allowNull defaults to true
    },
    password: {
      type: DataTypes.STRING, integer: true,
      allowNull: false,
    },
  },
  {
    // Other model options go here
  },
);

// `sequelize.define` also returns the model
console.log(User === sequelize.models.User); // true

export default User;