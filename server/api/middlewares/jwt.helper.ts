import L from '../../common/logger';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import CONFIG from '../config';
import * as Interfaces from '../interfaces';
import { RESPONSES } from '../constant/response';
import SetResponse from '../response/response.helper';
import { MESSAGES } from '../constant/response.messages';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
    userRole?: string;
  }
}

export class TokenHandler {
  generateToken = async (
    userId: string,
    expiresIn: string = ''
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      let expriryTime = expiresIn;
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.ENV_ERROR };
      }

      if (!expiresIn) {
        expriryTime = CONFIG.JWT.EXPIRES_IN as string;
      }

      const payload = {
        // aud: userId
      };

      const secret = CONFIG.JWT.ACCESS_SECRET;
      const options = {
        expiresIn: expriryTime,
        issuer: CONFIG.JWT.ISSUER,
        audience: userId,
      };
      const token = jwt.sign(payload, secret, options);
      if (!token)
        throw {
          message: MESSAGES.AUTH.TOKEN.GENERATE.error,
          status: RESPONSES.INTERNALSERVER,
        };

      return {
        data: token,
        error: false,
        message: MESSAGES.AUTH.TOKEN.GENERATE.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      L.error(error, 'JWT Helper - Error while generating token');
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };

  generateUserToken = async (
    email: any,
    address: any,
    loginType: any,
    expiresIn: any
  ): Promise<any> => {
    try {
      let expriryTime = expiresIn;
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.ENV_ERROR };
      }

      if (!expiresIn) {
        expriryTime = CONFIG.JWT.EXPIRES_IN as string;
      }

      const payload = {
        email: email,
        address: address,
        loginType: loginType,
      };

      const secret = CONFIG.JWT.ACCESS_SECRET;
      const options = {
        expiresIn: expriryTime,
        issuer: CONFIG.JWT.ISSUER,
      };
      const token = jwt.sign(payload, secret, options);
      if (!token)
        throw {
          message: MESSAGES.AUTH.TOKEN.GENERATE.error,
          status: RESPONSES.INTERNALSERVER,
        };

      return {
        data: token,
        error: false,
        message: MESSAGES.AUTH.TOKEN.GENERATE.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      L.error(error, 'JWT Helper - Error while generating token');
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
      return SetResponse.error(res, RESPONSES.UN_AUTHORIZED, {
        message: MESSAGES.AUTH.TOKEN.VERIFY.empty_token,
        error: true,
      });
    }
    try {
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.ENV_ERROR };
      }
      const { aud } = jwt.verify(
        token,
        CONFIG.JWT.ACCESS_SECRET
      ) as Interfaces.AuthTokenResponseType;
      console.log('auth:::', aud);

      req.userId = aud;
      return next();
    } catch (error: any) {
      L.error(error, 'JWT Helper - Error while verifying verify token');
      console.log(error, 'error');

      return SetResponse.error(res, RESPONSES.UN_AUTHORIZED, {
        message: MESSAGES.AUTH.TOKEN.VERIFY.expired_token,
        error: true,
      });
    }
  };

  verifyuserEmailToken = async (token: any) => {
    try {
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.ENV_ERROR };
      }
      console.log('token getting :: ', { token });
      const aud = jwt.verify(token, CONFIG.JWT.ACCESS_SECRET);
      console.log('auth:::', aud);
      return aud;
    } catch (error: any) {
      return error.message;
    }
  };

  generateRefreshToken = async (
    userId: string
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      if (!CONFIG.JWT.REFRESH_TOKEN) {
        throw { message: MESSAGES.ENV_ERROR };
      }
      const payload = {
        // aud: userId
      };
      const secret = CONFIG.JWT.REFRESH_TOKEN;
      const options = {
        expiresIn: '1m', // One month expiry
        issuer: CONFIG.JWT.ISSUER,
        audience: userId,
      };
      const token = jwt.sign(payload, secret, options);
      L.info('JWT Helper - Generating RefreshToken');

      if (!token)
        throw {
          message: MESSAGES.AUTH.REFRESH_TOKEN.GENERATE.error,
          status: RESPONSES.INTERNALSERVER,
        };
      return {
        data: token,
        error: false,
        message: MESSAGES.AUTH.REFRESH_TOKEN.GENERATE.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      L.error(error, 'JWT Helper - Error while generation refresh token');

      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };

  verifyRefreshToken = async (
    refreshToken: string
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      if (!CONFIG.JWT.REFRESH_TOKEN) {
        throw { message: MESSAGES.ENV_ERROR };
      }

      if (!refreshToken)
        throw {
          message: MESSAGES.AUTH.TOKEN.VERIFY.wrong_token,
          status: RESPONSES.UN_AUTHORIZED,
        };

      const { aud } = jwt.verify(
        refreshToken,
        CONFIG.JWT.REFRESH_TOKEN
      ) as Interfaces.AuthTokenResponseType;
      return {
        data: aud,
        error: false,
        message: MESSAGES.AUTH.REFRESH_TOKEN.VERIFY.success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      L.error(error, 'JWT Helper - Error while verifying refresh token');

      return {
        error: true,
        status: error.status ? error.status : RESPONSES.UN_AUTHORIZED,
        message: error.message,
      };
    }
  };

  verifyEmailToken = async (token: string) => {
    if (!token)
      return {
        message: MESSAGES.AUTH.TOKEN.VERIFY.empty_token,
        error: true,
        status: RESPONSES.UN_AUTHORIZED,
      };
    try {
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.ENV_ERROR };
      }
      const { aud } = jwt.verify(
        token,
        CONFIG.JWT.ACCESS_SECRET
      ) as Interfaces.AuthTokenResponseType;

      return aud;
    } catch (error: any) {
      L.error(error, 'JWT Helper - Error while verifying email token');
      return {
        message: MESSAGES.AUTH.TOKEN.VERIFY.expired_token,
        error: true,
        status: RESPONSES.UN_AUTHORIZED,
      };
    }
  };

  approveToken = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token)
      return SetResponse.error(res, RESPONSES.SUCCESS, {
        message: '',
        error: true,
      });
    try {
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.ENV_ERROR };
      }
      const { aud } = jwt.verify(
        token,
        CONFIG.JWT.ACCESS_SECRET
      ) as Interfaces.AuthTokenResponseType;

      // return SetResponse.error(res, RESPONSES.SUCCESS, {
      //   message: '',
      //   error: false,
      // });
      return next();
    } catch (error: any) {
      L.error(error, 'JWT Helper - Error while verifying verify token');

      return SetResponse.error(res, RESPONSES.SUCCESS, {
        message: '',
        error: true,
      });
    }
  };
  ownerVerifyToken = async (req: Request, _res: Response, next: NextFunction) => {
    const token = req.header('Authorization');
    if (!token) {
      return next()
    }
    try {
      if (!CONFIG.JWT.ACCESS_SECRET) {
        throw { message: MESSAGES.ENV_ERROR };
      }
      const { aud } = jwt.verify(
        token,
        CONFIG.JWT.ACCESS_SECRET
      ) as Interfaces.AuthTokenResponseType;
      console.log('auth:::', aud);

      req.userId = aud;
      return next();
    } catch (error: any) {

      return next()
    }
  };
}

export default new TokenHandler();
