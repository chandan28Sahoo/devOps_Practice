// https://sequelize.org/master/manual/model-basics.html
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection';
import * as bcrypt from 'bcrypt';
import { LOGINTYPE_ENUM } from '../constant/loginType.enum';
// import PostsModel from './posts.model';

const UsersModel = sequelize.define(
  'users',
  {
    userId: {
      type: DataTypes.STRING(300),
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    fullname: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    loginType: {
      type: DataTypes.ENUM,
      values: Object.values(LOGINTYPE_ENUM),
      defaultValue: LOGINTYPE_ENUM.EMAIL,
    },
    notification_email: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // bio: {
    //   type: DataTypes.TEXT,
    //   allowNull: true,
    // },
    role_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    isLoggedIn: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    isVerify: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1,
    },
    createdByAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    isKycDone: {
      type: DataTypes.ENUM,
      values: ['0', '1', '2'], // 0 = pending , 1 =  approved  3 = declined
      defaultValue: '0',
    },
  },
  {
    tableName: 'users',
    modelName: 'Users',
    hooks: {
      beforeCreate: async (Users: any) => {
        if (Users.password) {
          const salt = await bcrypt.genSaltSync(10);
          Users.password = bcrypt.hashSync(Users.password, salt);
        }
      },
      beforeUpdate: async (Users: any) => {
        if (Users.password) {
          const salt = await bcrypt.genSaltSync(10);
          Users.password = bcrypt.hashSync(Users.password, salt);
        }
      },
    },
  }
);
// UsersModel.hasMany(PostsModel,{
//   foreignKey: 'userId',
//   as: 'posts'
// });

// This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
UsersModel.sync({ alter: true });
export default UsersModel;
