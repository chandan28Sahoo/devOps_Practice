import { RESPONSES } from '../constant/response';
import axios from 'axios';
import date from 'date-and-time';
import * as Interface from '../interfaces';
import UsersModel from '../models/Users.model';
import dbUserService from './db.user.service';
import { MESSAGES } from '../constant/response.messages';
import nodeMailer from 'nodemailer';
const ejs = require('ejs');
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import CONFIG from '../config';
import console from 'console';
import { where } from 'sequelize/types';
const MAILERCONFIG = {
  host: process.env.NODE_MAILER_HOST as string,
  port: Number(process.env.NODE_MAILER_PORT),
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
};
const transporter = nodeMailer.createTransport(MAILERCONFIG);

export class AuthService {
  addUser = async (
    user: Interface.UserType
  ): Promise<Interface.PromiseResponse> => {
    try {
      // Checking Duplicate Email

      if (user.email) {
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@^^^^^^^^^^^^^@@@@@@@', user);
        //finding email from users table
        const emailExist: any = await dbUserService.getUserDetails({
          email: user.email,
        });

        if (!emailExist.error) {
          return {
            data: emailExist.data,
            message: MESSAGES.USER.REGISTER.duplicate_user,
            status: RESPONSES.BADREQUEST,
          };
        }
      }

      // Saving user on database
      const USER: any = await dbUserService.createUser(user);
      if (USER.error) throw USER;
      user.userId = USER.data.userId;
      user.token = USER.data.token;
      // console.log("USER###",USER);

      const SocialUser = await dbUserService.createSocialUser(user);
      if (SocialUser.error) throw USER;
      // console.log("SocialUser###",SocialUser);

      // sending mail if user signup from social login
      const filePath = `${process.cwd()}/server/api/middlewares/emailTemplate/socialSignUp.ejs`;
      const details: any = {
        fullname: USER?.data?.fullname,
        supportEmail: process.env.CONTACT_US_EMAIL,
        site_url: process.env.SITE_URL,
      };

      const htmlDetails = await ejs.renderFile(filePath, details, {
        async: true,
      });
      const mailOptions = {
        from: `${process.env.FROM_WEBSITE_NAME} <${process.env.FROM_EMAIL_ADDRESS}>`, // sender address
        to: `${USER?.data?.fullname} <${USER?.data?.email}>`, // list of receivers
        subject: 'Welcome to Cupchair', // Subject line
        html: htmlDetails,
      };
      const mailResponse: any = await transporter.sendMail(mailOptions);
      // console.log("mail$$$$$$$$$",mailResponse);
      // Sending success message if all validation passes
      return {
        data: USER.data,
        error: false,
        message: MESSAGES.USER.REGISTER.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      // Sending error message if any validation failed
      console.log('error from auth', error);

      return {
        error: true,
        message: error.message,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
      };
    }
  };
  getGoogleUserData = async ({
    access_token,
    id_token,
  }: Interface.AccessTokenType): Promise<Interface.PromiseResponse> => {
    try {
      console.log(access_token, id_token, '!!!!');
      // Getting data from google
      console.log(
        `${CONFIG.AUTH_LINK.GET_GOOGLE_DATA}?access_token=${access_token}`,
        'CONFIG.AUTH_LINK.GET_GOOGLE_DATA'
      );

      const { data } = await axios({
        url: `${CONFIG.AUTH_LINK.GET_GOOGLE_DATA}?access_token=${access_token}`,
        method: 'get',
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      });
      // Checking google data
      if (!data)
        throw {
          message: MESSAGES.INVALID_TOKEN,
          status: RESPONSES.BADREQUEST,
        };

      // Sending success message if all validation success
      return {
        data,
        error: false,
        message: MESSAGES.AUTH.GOOGLE.AUTH_TOKEN.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      console.log(error, 'err');
      // Sending error message if any validation failed
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };
  //getFacebookUserData
  getFacebookUserData = async ({
    access_token,
  }: Interface.AccessTokenType): Promise<Interface.PromiseResponse> => {
    try {
      // Geeting data from facebook
      const { data } = await axios({
        url: CONFIG.AUTH_LINK.GET_FACEBOOK_DATA,
        method: 'get',
        params: {
          fields: [
            'id',
            'email',
            'first_name',
            'last_name',
            'name',
            'picture',
          ].join(','),
          access_token,
        },
      });
      console.log('dtata>>>>>>>>>>', data);

      // Checking facebook data
      if (!data)
        throw {
          message: MESSAGES.INVALID_TOKEN,
          status: RESPONSES.UN_AUTHORIZED,
        };

      // Sending success message if all validation success
      return {
        data,
        error: false,
        message: MESSAGES.AUTH.FACEBOOK.AUTH_TOKEN.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      // Sending error message if any validation success
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };
  //
  updateGoogleUserData = async (
    user: Interface.UserType
  ): Promise<Interface.PromiseResponse> => {
    try {
      console.log(user, '@@@@');

      if (user.userId && user.token) {
        // Checking if account is found but not password
        const UpdateUser = await dbUserService.updateService(user);
        if (UpdateUser.error) throw UpdateUser;
        // console.log("^^^^^^^^^^^^^^^",UpdateUser);
        return {
          data: UpdateUser.data,
          error: false,
          message: MESSAGES.USER.REGISTER.success,
          status: RESPONSES.SUCCESS,
        };
      }
      return {};
    } catch (error: any) {
      console.log('erorrrrrrrrrrrrrrrrrrrrr', error);

      // Sending error message if any validation failed
      return {
        error: true,
        message: error.message,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
      };
    }
  };
  // updateFacebookUserData
  updateFacebookUserData = async (
    user: Interface.UserType
  ): Promise<Interface.PromiseResponse> => {
    try {
      console.log(user, '@@@@');

      if (user.userId && user.token) {
        // Checking if account is found but not password
        const UpdateUser = await dbUserService.updateService(user);
        if (UpdateUser.error) throw UpdateUser;
        console.log('^^^^^^^^^^^^^^^', UpdateUser);

        // Sending success message if all validation passes
        return {
          data: UpdateUser.data,
          error: false,
          message: MESSAGES.USER.REGISTER.success,
          status: RESPONSES.SUCCESS,
        };
      }
      return {};
    } catch (error: any) {
      console.log('erorrrrrrrrrrrrrrrrrrrrr', error);

      // Sending error message if any validation failed
      return {
        error: true,
        message: error.message,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
      };
    }
  };
}

export default new AuthService();
