import l from '../../common/logger';
import UsersModel from '../models/Users.model';
import UserSocialLoginModel from '../models/userSocialLogin';
import * as Interface from '../interfaces';
import { RESPONSES } from '../constant/response';
import { MESSAGES } from '../constant/response.messages';

// eslint-disable-next-line prettier/prettier
export class DBUserService {
  getUserDetails = async ({
    email,
  }: Interface.GetByNameKycType): Promise<Interface.PromiseResponse> => {
    try {
      console.log(email, 'Requested get user details');
      const userData = await UsersModel.findOne({
        where: { email: email },
        raw: true,
      });
      console.log('userData:::', userData);
      l.info(userData, 'User DB logger');

      if (!userData) {
        //not found any record for user
        console.log('in !userData', !userData);

        return {
          data: userData,
          error: true,
          message: 'No account found!',
          status: RESPONSES.SUCCESS,
        };
      } else if (userData && !userData.password) {
        //found account but not password
        console.log('in elseIf part...', userData && !userData.password);

        return {
          data: userData,
          error: false,
          message: 'User logged in through social ',
          status: RESPONSES.SUCCESS,
        };
      } else {
        // user's all record found (normal signup)
        console.log('in else part@@@');
        return {
          data: userData,
          error: false,
          message: MESSAGES.USER.GET_BY_NAME.failure,
          status: RESPONSES.UN_AUTHORIZED,
        };
      }
    } catch (error: any) {
      // Sending error message if any validation failed
      return {
        error: true,
        message: error.message,
        status: error.status ? error.status : RESPONSES.SUCCESS,
      };
    }
  };

  createUser = async (
    user: any //need to change interface Interface.UserType 2-3-22
  ): Promise<Interface.PromiseResponse> => {
    try {
      // Saving user on database
      // console.log("heheheheehehhehheehehehehehe in db.user");

      const addedUser = await UsersModel.create(user, { raw: true });
      console.log('aftre', addedUser);

      l.info(addedUser, 'DBUserService- User created successfully Data');
      // Returning success message if all validation passes
      return {
        data: addedUser.dataValues,
        error: false,
        message: MESSAGES.USER.CREATE.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      // Returning error message if any validation falied
      return {
        error: true,
        message: error.message,
        status: RESPONSES.SUCCESS,
      };
    }
  };

  createSocialUser = async (
    user: any //need to change interface Interface.UserType 2-3-22
  ): Promise<Interface.PromiseResponse> => {
    try {
      // Saving user on database

      const addedUser = await UserSocialLoginModel.create(user, { raw: true });
      console.log(
        'after createSocialUser',
        addedUser,
        'wwwwwwwwwwwwwwwwwwwwwwww'
      );

      l.info(
        addedUser,
        'DBUserService- User created in socialLogin successfully Data'
      );
      // Returning success message if all validation passes
      return {
        data: addedUser,
        error: false,
        message: MESSAGES.USER.CREATE.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      // Returning error message if any validation falied
      return {
        error: true,
        message: error.message,
        status: RESPONSES.SUCCESS,
      };
    }
  };

  //
  updateService = async (
    user: any //when email is found but password is empty 4-3-22
  ): Promise<Interface.PromiseResponse> => {
    try {
      // Saving user on database
      console.log(' in update db.user @@@', user);

      const updateUser = await UserSocialLoginModel.update(
        { token: user.token },
        { where: { userId: user.userId } }
      );
      console.log('dataaaaaaaaaaaaa', updateUser);

      l.info(
        updateUser,
        'DBUserService- User updated in socialLogin successfully Data'
      );
      // Returning success message if all validation passes
      return {
        data: updateUser,
        error: false,
        message: MESSAGES.USER.CREATE.update,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      // Returning error message if any validation falied
      return {
        error: true,
        message: error.message,
        status: RESPONSES.SUCCESS,
      };
    }
  };
}

// console.log("::::::::::::::::::inside update auth service",user);

export default new DBUserService();
