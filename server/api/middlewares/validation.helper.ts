import { NextFunction, Request, Response } from 'express';
import SetResponse from '../response/response.helper';
import { MESSAGES } from '../../api/constant/response.messages';
import { RESPONSES } from '../../api/constant/response';
import * as joiOptions from '../constant/joi.validation';
import JoiPasswordComplexity from 'joi-password';
import Joi from 'joi';
import * as Interfaces from '../../api/interfaces';
import UserHelper from '../../api/helpers/user.helper';
// import followerHelper from '../helpers/follower.helper';
// import Sequelize from 'sequelize';
import Sequelize from '../db/connection';
const { QueryTypes } = require('sequelize');
import {
  uploadKYC,
  uploadProfileImages,
  uploadNftImages as uploadS3NftImages,
  uploadNftWithWatermarkImages as uploadS3NftWithWatermarkImages,
  uploadNftVideos as uploadS3NftVideos,
  // uploadTempProfileImages,
} from '../../api/middlewares/filesProvider';
import l from '../../common/logger';
import config from '../config';
const dnsPromises = require('dns2');
import aws = require('aws-sdk');

const options = {
  // available options
  // dns: dns server ip address or hostname (string),
  // port: dns server port (number),
  // recursive: Recursion Desired flag (boolean, default true, since > v1.4.2)
};
const dns = new dnsPromises(options);
export class ValidationHandler {
  signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody = req.body;
      //Validate Email
      if (reqBody.email) {
        const emailInfo = await this.emailValidation(reqBody.email);
        if (emailInfo.error) throw emailInfo;
      }

      //Validate Password
      if (reqBody.password) {
        const passwordInfo = await this.passwordValidation(reqBody.password);
        if (passwordInfo.error) throw passwordInfo;
      }

      let transSchema = Joi.object({
        fullname: Joi.string()
          .trim()
          .min(3)
          .max(50)
          .required()
          .regex(/^[a-zA-Z ]*$/)
          .label('Full Name')
          .messages({
            'string.min': '{#label} Must have at least 3 characters',
            'object.regex': '{#label} Must have at least 3 characters',
            'string.pattern.base': '{#label} Must Have only Alphabets',
          }),
        email: Joi.string().trim().email().max(60).required(),
        username: Joi.string()
          .trim()
          .min(4)
          .max(20)
          .required()
          // .regex(/^[a-zA-Z0-9]*$/)
          .label('Username')
          .messages({
            'string.min': '{#label} Must have at least 3 characters',
            'object.regex': '{#label} Must have at least 3 characters',
            // 'string.pattern.base':
            //   '{#label} can only contain Alphabets or Numeric Value',
          }),
        password: Joi.string().trim().min(8).required(),
        confirmPassword: Joi.string()
          .trim()
          .equal(Joi.ref('password'))
          .required()
          .label('Confirm Password')
          .options({ messages: { 'any.only': '{{#label}} does not match' } }),
      });

      let messageChange = `${MESSAGES.USER.REGISTER.duplicate_user}`;
      if (reqBody.role_type) {
        messageChange = 'Artist Email Already Registered';
        let roleName = 'Artist';
        if (reqBody.role_type == 2) {
          roleName = 'Brand';
          messageChange = 'Brand Email Already Registered';
        }
        reqBody.brandId = `${reqBody.brandId}`;
        // const xVal = Math.floor(Math.random() * 10 + 1);
        // reqBody.username = reqBody.username + xVal.toString();
        transSchema = Joi.object({
          fullname: Joi.string()
            .trim()
            .min(3)
            .max(50)
            .required()
            .label(`${roleName} Name`)
            .messages({
              'string.min': '{#label} Must have at least 3 characters',
              'object.regex': '{#label} Must have at least 3 characters',
              'string.pattern.base': '{#label} Must Have only Alphabets',
            }),
          email: Joi.string().trim().email().max(60).required(),
          username: Joi.string()
            .trim()
            .min(4)
            .max(20)
            .label('Username')
            .messages({
              'string.min': '{#label} Must have at least 3 characters',
              'object.regex': '{#label} Must have at least 3 characters',
              'string.pattern.base':
                '{#label} can only contain Alphabets or Numeric Value',
            }),
          password: Joi.string().trim().min(8).required(),
          // bio: Joi.string().trim().min(10).label('Description').messages({
          //   'string.min': '{#label} Must have at least 10 characters',
          // }),
          role_type: Joi.number().required(),
          brandId: Joi.string().trim(),
          profileImage: Joi.string().trim(),
          showcaseImage: Joi.string().trim(),
          isFeatured: Joi.number().min(0).max(1),
          subTitle: Joi.string().trim(),
          coverImage: Joi.string().trim().optional(),
          users_url: Joi.string().trim().optional(),
          comment: Joi.string().trim().optional(),
        });
      }

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      //Get User details BY email
      const isEamilExist = await UserHelper.getUserInfo({
        email: reqBody.email,
      });

      if (isEamilExist) {
        return res.status(RESPONSES.SUCCESS).send({
          message: MESSAGES.USER.REGISTER.DUPLICATE_EMAIL,
          error: false,
        });
      }

      //Get User details BY userName
      // const isUserNameExist = await UserHelper.getInfoByUsername({
      //   username: reqBody.username,
      // });

      // if (isUserNameExist) {
      //   throw {
      //     message: MESSAGES.USER.REGISTER.DUPLICATE_USERNAME,
      //     status: RESPONSES.BADREQUEST,
      //   };
      // }

      // //Get User details BY email
      // let userInfo = await UserHelper.getUserInfo({
      //   email: reqBody.email,
      // });

      // if (userInfo.userId) {
      //   return SetResponse.success(res, RESPONSES.BADREQUEST, {
      //     message: messageChange,
      //     error: true,
      //   });
      // }

      // //Get User details BY userName
      // userInfo = await UserHelper.getInfoByUsername({
      //   username: reqBody.username,
      // });
      // if (userInfo.userId) {
      //   return SetResponse.success(res, RESPONSES.BADREQUEST, {
      //     message: messageChange,
      //     error: true,
      //   });
      // }
      return next();
    } catch (error: any) {
      return SetResponse.error(
        res,
        error.status ? error.status : RESPONSES.BADREQUEST,
        {
          message: error.message,
          error: error.error ? error.error : true,
        }
      );
    }
  };

  signin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody: Interfaces.UserSignin = req.body;
      // if (reqBody.password) {
      //   const passwordInfo = await this.passwordValidation(reqBody.password);
      //   if (passwordInfo.error) throw passwordInfo;
      // }

      const transSchema = Joi.object({
        email: Joi.string().trim().email().required(),
        password: Joi.string().trim().required(),
        // deviceToken: Joi.string().trim().required()
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      //Get User details BY email
      const userInfo = await UserHelper.getUserInfo({
        email: reqBody.email,
      });
      console.log('userInfo+++', userInfo);
      if (userInfo && userInfo.userId && userInfo.password !== null) {
        const isActive =
          typeof userInfo.isActive !== 'undefined' &&
          parseInt(userInfo.isActive) === 1
            ? true
            : false;
        if (!!isActive === false) {
          throw new Error(
            'Your account has been blocked. Please Contact us for more detail'
          );
        }
        return next();
      }

      return SetResponse.success(res, RESPONSES.BADREQUEST, {
        message: MESSAGES.USER.LOGIN.wrong_details,
        error: true,
      });
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  // forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const reqBody = req.body;
  //     const transSchema = Joi.object({
  //       email: Joi.string().trim().email().required(),
  //     });

  //     const { error } = transSchema.validate(reqBody, joiOptions.options);
  //     if (error)
  //       throw {
  //         message: joiOptions.capitalize(error.details[0].message),
  //       };

  //     //Get User details BY email
  //     const userInfo = await UserHelper.getUserInfo({
  //       email: reqBody.email,
  //     });
  //     if (userInfo && userInfo.userId) {
  //       req.body.fullname = userInfo.fullname;
  //       req.body.userId = userInfo.userId;
  //       req.body.username = userInfo.username;
  //       return next();
  //     }

  //     return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //       message: MESSAGES.USER.LOGIN.wrong_email,
  //       error: true,
  //     });
  //   } catch (error: any) {
  //     return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //       message: error.message,
  //       error: true,
  //     });
  //   }
  // };

  subscribe = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody = req.body;
      const transSchema = Joi.object({
        email: Joi.string().trim().email().required(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId as string;
      //Get User details BY Id
      const userInfo: any = await UserHelper.getUserProfile({
        userId,
      });
      console.log(userInfo, 'userInfo');
      if (!userInfo.error || userInfo.data || userInfo.data.isActive === 1) {
        return next();
      }

      return SetResponse.success(res, RESPONSES.UN_AUTHORIZED, {
        message: userInfo.message,
        error: true,
      });
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.UN_AUTHORIZED, {
        message: error.message,
        error: true,
      });
    }
  };

  uploadNftWithWatermarkImages = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    uploadS3NftWithWatermarkImages(req, res, async (err: any) => {
      try {
        if (err) {
          return SetResponse.error(res, 422, {
            message: err.message,
            error: true,
          });
        }
        if (req.files && req.files.length > 0) {
          const files = req.files as unknown as Express.MulterS3.File[];
          if (!files) {
            return SetResponse.error(res, RESPONSES.BADREQUEST, {
              error: true,
              message: 'Please upload file',
            });
          }
          const bannerImageJson = files.map(
            (file: any) => (file = { id: file.fieldname, url: file.location })
          );
          console.log(bannerImageJson);
          return next();
        } else {
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
            message: 'Please upload file',
            error: true,
          });
        }
      } catch (err: any) {
        return SetResponse.error(res, RESPONSES.BADREQUEST, {
          message: err.message,
          error: true,
        });
      }
    });
  };

  // uploadNftImages = async (req: Request, res: Response, next: NextFunction) => {
  //   uploadS3NftImages(req, res, async (err: any) => {
  //     try {
  //       if (err) {
  //         return SetResponse.error(res, 422, {
  //           message: err.message,
  //           error: true,
  //         });
  //       }
  //       if (req.files && req.files.length > 0) {
  //         const files = req.files as unknown as Express.MulterS3.File[];
  //         if (!files) {
  //           return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //             error: true,
  //             message: 'Please upload file',
  //           });
  //         }
  //         const bannerImageJson = files.map(
  //           (file: any) => (file = { id: file.fieldname, url: file.location })
  //         );
  //         console.log(bannerImageJson);
  //         return next();
  //       } else {
  //         return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //           message: 'Please upload file',
  //           error: true,
  //         });
  //       }
  //     } catch (error: any) {
  //       return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //         message: error.message,
  //         error: true,
  //       });
  //     }
  //   });
  // };

  // uploadNftVideos = async (req: Request, res: Response, next: NextFunction) => {
  //   uploadS3NftVideos(req, res, async (err: any) => {
  //     try {
  //       if (err) {
  //         return SetResponse.error(res, 422, {
  //           message: err.message,
  //           error: true,
  //         });
  //       }
  //       if (req.files && req.files.length > 0) {
  //         const files = req.files as unknown as Express.MulterS3.File[];
  //         if (!files) {
  //           return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //             error: true,
  //             message: 'Please upload file',
  //           });
  //         }
  //         const bannerImageJson = files.map(
  //           (file: any) => (file = { id: file.fieldname, url: file.location })
  //         );
  //         console.log(bannerImageJson);
  //         return next();
  //       } else {
  //         return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //           message: 'Please upload file',
  //           error: true,
  //         });
  //       }
  //     } catch (error: any) {
  //       return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //         message: error.message,
  //         error: true,
  //       });
  //     }
  //   });
  // };

  uploadImages = async (req: Request, res: Response, next: NextFunction) => {
    uploadProfileImages(req, res, async (err: any) => {
      try {
        console.log('errImage ::: ', err);

        if (err) {
          return SetResponse.error(res, 422, {
            message: err.message,
            error: true,
          });
        }
        if (req.files && req.files.length > 0) {
          const files = req.files as unknown as Express.MulterS3.File[];
          if (!files) {
            return SetResponse.error(res, RESPONSES.BADREQUEST, {
              error: true,
              message: 'Please upload file',
            });
          }
          const bannerImageJson = files.map(
            (file: any) => (file = { id: file.fieldname, url: file.location })
          );
          console.log(bannerImageJson);
          return next();
        } else {
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
            message: 'Please upload file',
            error: true,
          });
        }
      } catch (error: any) {
        return SetResponse.error(res, RESPONSES.BADREQUEST, {
          message: error.message,
          error: true,
        });
      }
    });
  };
  // uploadImagesDisk = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   uploadTempProfileImages(req, res, async (err: any) => {
  //     try {
  //       if (err) {
  //         return SetResponse.error(res, 422, {
  //           message: err.message,
  //           error: true,
  //         });
  //       }
  //       if (req.files && req.files.length > 0) {
  //         const files = req.files as unknown as Express.MulterS3.File[];
  //         if (!files) {
  //           return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //             error: true,
  //             message: 'Please upload file',
  //           });
  //         }
  //         const bannerImageJson = files.map(
  //           (file: any) => (file = { id: file.fieldname, url: file.location })
  //         );
  //         console.log(bannerImageJson);
  //         return next();
  //       } else {
  //         return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //           message: 'Please upload file',
  //           error: true,
  //         });
  //       }
  //     } catch (error: any) {
  //       return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //         message: error.message,
  //         error: true,
  //       });
  //     }
  //   });
  // };

  // uploadKyc = async (req: Request, res: Response) => {
  //   uploadKYC(req, res, async (err: any) => {
  //     try {
  //       if (err) {
  //         return SetResponse.error(res, 422, {
  //           message: err.message,
  //           error: true,
  //         });
  //       }
  //       if (req.files && req.files.length > 0) {
  //         const files = req.files as unknown as Express.MulterS3.File[];
  //         if (!files) {
  //           return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //             error: true,
  //             message: 'Please upload file',
  //           });
  //         }
  //         const REGION = config.S3.S3_REGION;
  //         const S3_BUCKET_KYC = config.S3.S3_BUCKET_KYC;
  //         const URL_EXPIRATION_TIME = 120; // in seconds
  //         const myBucket = new aws.S3({
  //           params: { Bucket: S3_BUCKET_KYC },
  //           region: REGION,
  //         });

  //         const KYCImageJSON = files.map(
  //           (file: any) =>
  //             (file = {
  //               key: file.key,
  //               original: file.location,
  //               url: file.location,
  //             })
  //         );
  //         const tempFile = myBucket.getSignedUrl('getObject', {
  //           Key: KYCImageJSON[0].key,
  //           Expires: URL_EXPIRATION_TIME,
  //         });
  //         // console.log(tempFile)
  //         KYCImageJSON[0].url = tempFile ? tempFile : KYCImageJSON[0].original;
  //         return SetResponse.success(res, RESPONSES.SUCCESS, {
  //           message: 'File Uploaded Successfully',
  //           error: false,
  //           data: KYCImageJSON,
  //         });
  //       } else {
  //         return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //           message: 'Please upload file',
  //           error: true,
  //         });
  //       }
  //     } catch (error: any) {
  //       return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //         message: error.message,
  //         error: true,
  //       });
  //     }
  //   });
  // };

  // updatePassword = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const reqBody = req.body;
  //     if (reqBody.password) {
  //       const passwordInfo = await this.passwordValidation(reqBody.password);
  //       if (passwordInfo.error) throw passwordInfo;
  //     }

  //     const transSchema = Joi.object({
  //       password: Joi.string().trim().min(8).required(),
  //       confirmPassword: Joi.string()
  //         .trim()
  //         .equal(Joi.ref('password'))
  //         .required()
  //         .label('Confirm Password')
  //         .options({ messages: { 'any.only': '{{#label}} does not match' } }),
  //     });

  //     const { error } = transSchema.validate(reqBody, joiOptions.options);
  //     if (error)
  //       throw {
  //         message: joiOptions.capitalize(error.details[0].message),
  //       };

  //     //Get User details BY email
  //     const userInfo = await UserHelper.getUserInfo({
  //       email: req.userId as string,
  //     });
  //     console.log('userInfo@@', userInfo);

  //     if (userInfo && userInfo.userId) {
  //       const tokenValue: string = req.header('Authorization') as string;
  //       const responseDb = await UserHelper.verifyTokenDB({
  //         userid: userInfo.userId,
  //         token: tokenValue,
  //       });
  //       console.log('responseDb~~~~');

  //       if (!responseDb) {
  //         return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //           message: MESSAGES.AUTH.TOKEN.VERIFY.expired_token,
  //           error: true,
  //         });
  //       }
  //       req.userId = userInfo.userId;
  //       return next();
  //     }

  //     return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //       message: MESSAGES.AUTH.TOKEN.VERIFY.expired_token,
  //       error: true,
  //     });
  //   } catch (error: any) {
  //     return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //       message: error.message,
  //       error: true,
  //     });
  //   }
  // };

  contactus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody = req.body;
      const transSchema = Joi.object({
        email: Joi.string().trim().email().required(),
        userName: Joi.string().trim().min(3).required(),
        phone: Joi.string().trim().min(8).required(),
        companyName: Joi.string().trim().min(3).required(),
        website: Joi.string().trim().min(5).required(),
        message: Joi.string().trim().min(8).required(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  passwordValidation = async (
    password: string
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const passwordSchema = Joi.object({
        password: JoiPasswordComplexity.string()
          .minOfSpecialCharacters(1)
          // .minOfLowercase(1)
          // .minOfUppercase(1)
          .minOfNumeric(0)
          .noWhiteSpaces()
          .min(8)
          .max(30)
          .required()
          .messages({
            // 'password.minOfUppercase': MESSAGES.USER.REGISTER.UPPER_CASE,
            // 'password.minOfLowercase': MESSAGES.USER.REGISTER.LOWER_CASE,
            'password.minOfSpecialCharacters':
              MESSAGES.USER.REGISTER.SPECIAL_CHAR,
            'password.minOfNumeric': MESSAGES.USER.REGISTER.NUMERIC,
            'password.noWhiteSpaces': `${MESSAGES.USER.REGISTER.WHITE_SPACE} in Password`,
            'password.min': MESSAGES.USER.REGISTER.password_error,
            'password.max': MESSAGES.USER.REGISTER.password_error,
          }),
      });

      // Checking if password validation failed

      const { error } = passwordSchema.validate(
        { password },
        joiOptions.options
      );

      // Throwing error if any validation failed
      if (error) {
        console.log(
          { error: error },
          'Validation Helper- error while password validation failed'
        );

        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      }
      return {
        error: false,
        message: 'Password validation success',
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      console.log('error Password validation: ', error);
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };

  emailValidation = async (
    email: string
  ): Promise<Interfaces.PromiseResponse> => {
    try {
      const domainValidate = email.substring(email.lastIndexOf('@') + 1);
      console.log(domainValidate);

      const domainsExclude = process.env.EXCLUDE_DOMAINS as string;
      const invalidDomains = domainsExclude.split(',');
      if (invalidDomains.includes(domainValidate)) {
        throw {
          message: 'Email Domain is Blacklisted',
        };
      }
      const responseHostmane: any = await this.hostnameExists(domainValidate);
      l.info(responseHostmane, 'Responsehostmanem');
      if (!responseHostmane.exists) {
        throw {
          message: 'Invalid Email',
        };
      }
      return {
        error: false,
        // message: 'Email validation success',
        message: MESSAGES.USER.REGISTER.verify_email_success,
        status: RESPONSES.SUCCESS,
      };
    } catch (error: any) {
      l.error('error Email validation: ', error);
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };

  userWalletInfo = async (address: any): Promise<any> => {
    try {
      console.log('address::::', address);
      const dataRes: any = await Sequelize.query(
        `SELECT u1.email FROM walletAddress as w1 LEFT JOIN users AS u1 ON w1.userId = u1.userId WHERE w1.address='${address}'`,
        {
          type: QueryTypes.SELECT,
        }
      );
      console.log('dataRes:::', dataRes);
      return {
        error: false,
        message: 'Email validation success',
        status: RESPONSES.SUCCESS,
        data: dataRes,
      };
    } catch (error: any) {
      l.error('error Email validation: ', error);
      return {
        error: true,
        status: error.status ? error.status : RESPONSES.BADREQUEST,
        message: error.message,
      };
    }
  };

  hasWhiteSpace(value: string) {
    return /\s/.test(value);
  }

  hostnameExists = async (hostname: string): Promise<any> => {
    try {
      l.info(hostname, 'IN HostnameExists');
      const result = await dns.resolveA(hostname);
      if (result.answers.length > 0) {
        return { exists: true };
      }
      return { exists: false };
    } catch (_) {
      return { exists: false };
    }
  };

  emailVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqBody = req.body;
      const transSchema = Joi.object({
        email: Joi.string().trim().email().required(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      //Get User details BY email
      const userInfo = await UserHelper.getUserInfo({
        email: reqBody.email,
      });

      if (userInfo && userInfo.userId) {
        if (userInfo.isVerify) {
          return SetResponse.error(res, RESPONSES.BADREQUEST, {
            message: MESSAGES.USER.REGISTER.verify_email_already,
            error: true,
          });
        }
        req.userId = userInfo.userId;
        req.body.fullname = userInfo.fullname;
        req.body.email = userInfo.email;
        req.body.username = userInfo.username;
        return next();
      }

      return SetResponse.success(res, RESPONSES.BADREQUEST, {
        message: MESSAGES.USER.LOGIN.wrong_email,
        error: true,
      });
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };
  photographer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reqBody = req.body;
      const transSchema = Joi.object({
        mobile_no: Joi.number().required(),
        user_catagory: Joi.object().required(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };
  validatephotographer = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqBody = req.body;
      const transSchema = Joi.object({
        userid: Joi.string().required(),
        status: Joi.number().required(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };
  // followValidation = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const userId: any = req.params.id as string;
  //     const followerId = req.userId as string;

  //     //Get User details BY Id
  //     const userInfo: any = await followerHelper.getActiveFollower(
  //       userId,
  //       followerId
  //     );
  //     console.log(userInfo, 'userInfo');
  //     if (userInfo === null || userInfo === undefined) {
  //       return next();
  //     }

  //     return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //       message: 'You Already Follow this user',
  //       error: true,
  //     });
  //   } catch (error: any) {
  //     return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //       message: error.message,
  //       error: true,
  //     });
  //   }
  // };
  // unfollowValidation = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const userId: any = req.params.id as string;
  //     const followerId = req.userId as string;
  //     //Get User details BY Id
  //     const userInfo: any = await followerHelper.getInActiveFollower(
  //       userId,
  //       followerId
  //     );
  //     if (userInfo === null || userInfo === undefined) {
  //       return next();
  //     }

  //     return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //       message: 'You Already Unfollow this user',
  //       error: true,
  //     });
  //   } catch (error: any) {
  //     return SetResponse.error(res, RESPONSES.BADREQUEST, {
  //       message: error.message,
  //       error: true,
  //     });
  //   }
  // };

  // creatorValidation = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ) => {
  //   try {
  //     const reqBody = req.body;
  //     //Validate Email
  //     if (reqBody.email) {
  //       const emailInfo = await this.emailValidation(reqBody.email);
  //       if (emailInfo.error) throw emailInfo;
  //     }

  //     let transSchema = Joi.object({
  //       fullname: Joi.string()
  //         .trim()
  //         .min(3)
  //         .max(50)
  //         .optional()
  //         .allow('')
  //         .regex(/^[a-zA-Z ]*$/)
  //         .label('Full Name')
  //         .messages({
  //           'string.min': '{#label} Must have at least 3 characters',
  //           'object.regex': '{#label} Must have at least 3 characters',
  //           'string.pattern.base': '{#label} Must Have only Alphabets',
  //         }),
  //       // email: Joi.string().trim().email().max(60).optional().allow(''),
  //       username: Joi.string()
  //         .trim()
  //         .min(4)
  //         .max(20)
  //         .label('Username')
  //         .messages({
  //           'string.min': '{#label} Must have at least 3 characters',
  //           'object.regex': '{#label} Must have at least 3 characters',
  //           'string.pattern.base':
  //             '{#label} can only contain Alphabets or Numeric Value',
  //         }),

  //       profileImage: Joi.string().trim().allow(''),
  //       publicEthAddress: Joi.string().trim().optional().allow(''),
  //       // bio: Joi.string().trim(),
  //       date_of_birth: Joi.date(),
  //       name: Joi.string()
  //         .trim()
  //         .min(3)
  //         .max(50)
  //         .optional()
  //         .allow('')
  //         .regex(/^[a-zA-Z ]*$/)
  //         .label('Name')
  //         .messages({
  //           'string.min': '{#label} Must have at least 3 characters',
  //           'object.regex': '{#label} Must have at least 3 characters',
  //           'string.pattern.base': '{#label} Must Have only Alphabets',
  //         }),
  //       mobile_no: Joi.string()
  //         .length(10)
  //         .pattern(/^[0-9]+$/),
  //       document_front: Joi.string().trim().optional().allow(''),
  //       document_back: Joi.string().trim().optional().allow(''),
  //       documentType: Joi.string().trim().optional().allow(''),
  //       countryId: Joi.string().trim().optional().allow(''),
  //       countryName: Joi.string().trim().optional().allow(''),
  //       dial_code: Joi.string().trim().optional().allow(''),
  //       instagramId: Joi.string().trim().optional().allow(''),
  //       onlyfansId: Joi.string().trim().optional().allow(''),
  //       tiktokId: Joi.string().trim().optional().allow(''),
  //       twitterId: Joi.string().trim().optional().allow(''),
  //       isInstagramToggled: Joi.number().min(0).max(1),
  //       isOnlyFansToggled: Joi.number().min(0).max(1),
  //       isTikTokToggled: Joi.number().min(0).max(1),
  //       isTwitterToggled: Joi.number().min(0).max(1),
  //       website: Joi.string().trim().optional().allow(''),
  //       coverImage: Joi.string().trim().optional().allow(''),
  //       comment: Joi.string().trim().optional().allow(''),
  //       postalcode: Joi.string().trim().optional().allow(''),
  //       user_url: Joi.string().trim().optional().allow(''),
  //     });

  //     const { error } = transSchema.validate(reqBody, joiOptions.options);
  //     if (error)
  //       throw {
  //         message: joiOptions.capitalize(error.details[0].message),
  //       };

  //     //Get User details BY email
  //     // const isEamilExist = await UserHelper.getUserInfo({
  //     //   email: reqBody.email,
  //     // });
  //     // console.log(isEamilExist, 'isEamilExist');

  //     // if (isEamilExist.email ===reqBody.email) {
  //     //   return res.status(RESPONSES.SUCCESS).send({
  //     //     message: MESSAGES.USER.REGISTER.DUPLICATE_Creator,
  //     //     error: false,
  //     //   });
  //     // }
  //     //Get User details BY userName
  //     // const isUserNameExist = await UserHelper.getInfoByUsername({
  //     //   username: reqBody.username,
  //     // });

  //     // if (isUserNameExist) {
  //     //   throw {
  //     //     message: MESSAGES.USER.REGISTER.DUPLICATE_USERNAME,
  //     //     status: RESPONSES.BADREQUEST,
  //     //   };
  //     // }
  //     //Get User details BY email
  //     // const isEamilExist = await UserHelper.getUserInfo({
  //     //   email: reqBody.email,
  //     // });

  //     // if (isEamilExist) {
  //     //   return res.status(RESPONSES.SUCCESS).send({
  //     //     message: MESSAGES.USER.REGISTER.DUPLICATE_Creator,
  //     //     error: false,
  //     //   });
  //     // }

  //     // //Get User details BY email
  //     // let userInfo = await UserHelper.getUserInfo({
  //     //   email: reqBody.email,
  //     // });

  //     // if (userInfo.userId) {
  //     //   return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //     //     message: messageChange,
  //     //     error: true,
  //     //   });
  //     // }

  //     // //Get User details BY userName
  //     // userInfo = await UserHelper.getInfoByUsername({
  //     //   username: reqBody.username,
  //     // });
  //     // if (userInfo.userId) {
  //     //   return SetResponse.success(res, RESPONSES.BADREQUEST, {
  //     //     message: messageChange,
  //     //     error: true,
  //     //   });
  //     // }
  //     return next();
  //   } catch (error: any) {
  //     return SetResponse.error(
  //       res,
  //       error.status ? error.status : RESPONSES.BADREQUEST,
  //       {
  //         message: error.message,
  //         error: error.error ? error.error : true,
  //       }
  //     );
  //   }
  // };

  creatorUpdateValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqBody = req.body;
      console.log(reqBody.email, 'reqBody.email');

      //Validate Email
      if (reqBody.email) {
        const emailInfo = await this.emailValidation(reqBody.email);
        if (emailInfo.error) throw emailInfo;
      }

      let transSchema = Joi.object({
        // fullname: Joi.string()
        // .trim()
        // .min(3)
        // .max(50)
        // .optional()
        // .allow('')
        // .regex(/^[a-zA-Z ]*$/)
        // .label('Full Name')
        // .messages({
        //   'string.min': '{#label} Must have at least 3 characters',
        //   'object.regex': '{#label} Must have at least 3 characters',
        //   'string.pattern.base': '{#label} Must Have only Alphabets',
        // }),
        // email: Joi.string().trim().email().max(60),
        username: Joi.string()
          .trim()
          .min(4)
          .max(20)
          .label('Username')
          .messages({
            'string.min': '{#label} Must have at least 3 characters',
            'object.regex': '{#label} Must have at least 3 characters',
            'string.pattern.base':
              '{#label} can only contain Alphabets or Numeric Value',
          }),

        // profileImage: Joi.string().trim().allow(''),
        // publicEthAddress: Joi.string().trim().optional().allow(''),
        // about_me: Joi.string().trim().optional().allow(''),
        // date_of_birth: Joi.date().optional().allow(''),
        // name: Joi.string()
        //   .trim()
        //   .min(3)
        //   .max(50)
        //   .regex(/^[a-zA-Z ]*$/)
        //   .label('Name')
        //   .messages({
        //     'string.min': '{#label} Must have at least 3 characters',
        //     'object.regex': '{#label} Must have at least 3 characters',
        //     'string.pattern.base': '{#label} Must Have only Alphabets',
        //   }),
        // mobile_no: Joi.string()
        //   .length(10)
        //   .pattern(/^[0-9]+$/)
        //   .optional()
        //   .allow(''),
        // user_url: Joi.string().trim().optional().allow(''),
        // document_front: Joi.string().trim().optional().allow(''),
        // document_back: Joi.string().trim().optional().allow(''),
        // documentType: Joi.string().trim().optional().allow(''),
        // countryId: Joi.string().trim().optional().allow(''),
        // countryName: Joi.string().trim().optional().allow(''),
        // dial_code: Joi.string().trim().optional().allow(''),
        // instagramId: Joi.string().trim().optional().allow(''),
        // onlyfansId: Joi.string().trim().optional().allow(''),
        // tiktokId: Joi.string().trim().optional().allow(''),
        // twitterId: Joi.string().trim().optional().allow(''),
        // isInstagramToggled: Joi.number().min(0).max(1),
        // isOnlyFansToggled: Joi.number().min(0).max(1),
        // isTikTokToggled: Joi.number().min(0).max(1),
        // isTwitterToggled: Joi.number().min(0).max(1),
        // website: Joi.string().trim().optional().allow(''),
        // coverImage: Joi.string().trim().optional().allow(''),
        // comment: Joi.string().trim().optional().allow(''),
        // state: Joi.string().trim().optional().allow(''),
        // stateId: Joi.string().trim().optional().allow(''),
        // cityId: Joi.string().trim().optional().allow(''),
        // city: Joi.string().trim().optional().allow(''),
        // address: Joi.string().trim().optional().allow(''),
        // postalCode: Joi.string().trim().optional().allow(''),
        // users_url: Joi.string().trim().optional().allow(''),
        // nftCollection: Joi.array().optional().allow(''),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      //Get User details BY email
      // const isEamilExist = await UserHelper.getUserInfo({
      //   email: reqBody.email,
      // });
      // console.log(isEamilExist, 'isEamilExist');

      // if (isEamilExist.email ===reqBody.email) {
      //   return res.status(RESPONSES.SUCCESS).send({
      //     message: MESSAGES.USER.REGISTER.DUPLICATE_Creator,
      //     error: false,
      //   });
      // }
      //Get User details BY userName
      // const isUserNameExist = await UserHelper.getInfoByUsername({
      //   username: reqBody.username,
      // });

      // if (isUserNameExist) {
      //   throw {
      //     message: MESSAGES.USER.REGISTER.DUPLICATE_USERNAME,
      //     status: RESPONSES.BADREQUEST,
      //   };
      // }

      // //Get User details BY email
      // let userInfo = await UserHelper.getUserInfo({
      //   email: reqBody.email,
      // });

      // if (userInfo.userId) {
      //   return SetResponse.success(res, RESPONSES.BADREQUEST, {
      //     message: messageChange,
      //     error: true,
      //   });
      // }

      // //Get User details BY userName
      // userInfo = await UserHelper.getInfoByUsername({
      //   username: reqBody.username,
      // });
      // if (userInfo.userId) {
      //   return SetResponse.success(res, RESPONSES.BADREQUEST, {
      //     message: messageChange,
      //     error: true,
      //   });
      // }
      return next();
    } catch (error: any) {
      return SetResponse.error(
        res,
        error.status ? error.status : RESPONSES.BADREQUEST,
        {
          message: error.message,
          error: error.error ? error.error : true,
        }
      );
    }
  };
  adminCreatorValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqBody = req.body;
      //Validate Email
      if (reqBody.email) {
        const emailInfo = await this.emailValidation(reqBody.email);
        if (emailInfo.error) throw emailInfo;
      }
      let transSchema = Joi.object({
        email: Joi.string().trim().email().max(60),
        username: Joi.string()
          .trim()
          .min(4)
          .max(20)
          .label('Username')
          .messages({
            'string.min': '{#label} Must have at least 3 characters',
            'object.regex': '{#label} Must have at least 3 characters',
            'string.pattern.base':
              '{#label} can only contain Alphabets or Numeric Value',
          }),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      //Get User details BY userName
      // const isUserNameExist = await UserHelper.getInfoByUsername({
      //   username: reqBody.username,
      // });

      // if (isUserNameExist) {
      //   throw {
      //     message: MESSAGES.USER.REGISTER.DUPLICATE_USERNAME,
      //     status: RESPONSES.BADREQUEST,
      //   };
      // }
      //Get User details BY email
      const isEamilExist = await UserHelper.getUserInfo({
        email: reqBody.email,
      });

      if (isEamilExist) {
        return res.status(RESPONSES.SUCCESS).send({
          message: MESSAGES.USER.REGISTER.DUPLICATE_Creator,
          error: false,
        });
      }
      return next();
    } catch (error: any) {
      return SetResponse.error(
        res,
        error.status ? error.status : RESPONSES.BADREQUEST,
        {
          message: error.message,
          error: error.error ? error.error : true,
        }
      );
    }
  };
  collectionValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let reqBody = req.body;
      const transSchema = Joi.object({
        name: Joi.string().trim().required(),
        logo: Joi.string().trim().required(),
        banner: Joi.string().trim().required(),
        featuredImage: Joi.string().trim().required(),
        royalty: Joi.number().required(),
        collectionUrl: Joi.string().trim().required(),
        externalLink: Joi.string().trim().allow(null, ''),
        description: Joi.string().trim().optional(),
        blockChainId: Joi.number().required(),
        categoryId: Joi.string().required(),
        sensitiveContent: Joi.bool().optional(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
  paginationAndFilterValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let transSchema2: any;
      let reqParam;
      let reqQuery;
      reqParam = req.params;
      console.log('inside req.params', reqParam);
      transSchema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number().required(),
        role_type: Joi.number().allow(null, ''),
        id: Joi.string()
          .allow(null, '')
          .regex(
            /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
          )
          .message('ID did  not found'),
      });
      if (req.query) {
        reqQuery = req.query;
        console.log('inside req.query', reqQuery);
        transSchema2 = Joi.object({
          searchText: Joi.string().trim().allow(null, ''),
          // .regex(
          //   /^(?=[A-Za-z@#$%^&+=]{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/
          // ),
          sortBy: Joi.string().trim().allow(null, ''),
          creatorId: Joi.string()
            .allow(null, '')
            .regex(
              /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
            )
            .message('ID did  not found'),
          role_type: Joi.number().min(1).max(3).allow(null, ''),
          fromAdmin: Joi.bool().allow(null, ''),
          publicEthAddress: Joi.string().allow(null, ''),
          filter: Joi.string().allow(null, ''),
        });
      }

      const { error } = transSchema.validate(reqParam, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      if (req.query) {
        const { error } = transSchema2.validate(reqQuery, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
  userEmailValidate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const reqBody = req.body;
      const transSchema = Joi.object({
        email: Joi.string().trim().email().required(),
        address: Joi.string().max(42).required(),
        loginType: Joi.string().required(),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      return SetResponse.error(res, RESPONSES.BADREQUEST, {
        message: error.message,
        error: true,
      });
    }
  };

  updatePhotographerValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // let reqParam = req.params;
      // if (reqParam) {
      //   let paramSchema = Joi.object({
      //     id: Joi.string()
      //       .required()
      //       .regex(
      //         /^[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}$/
      //       )
      //       .message('ID did  not found'),
      //   });

      //   const { error } = paramSchema.validate(reqParam, joiOptions.options);
      //   if (error)
      //     throw {
      //       message: joiOptions.capitalize(error.details[0].message),
      //     };
      // }

      let reqBody = req.body;
      const transSchema = Joi.object({
        fullname: Joi.string().allow(null, ''),
        email: Joi.string().email().trim().allow(null, ''),
        publicEthAddress: Joi.string().trim().allow(null, ''),
        bio: Joi.string().allow(null, ''),
        website: Joi.string().allow(null, ''),
        username: Joi.string().trim().required(),
        users_url: Joi.string().trim().allow(null, ''),
        mobile_no: Joi.string().allow(null, ''),
        date_of_birth: Joi.date().allow(null, ''),
        countryName: Joi.string().allow(null, ''),
        countryId: Joi.string().allow(null, ''),
        stateId: Joi.string().allow(null, ''),
        state: Joi.string().allow(null, ''),
        cityId: Joi.string().allow(null, ''),
        city: Joi.string().allow(null, ''),
        address: Joi.string().allow(null, ''),
        postalCode: Joi.string().allow(null, ''),
        profileImage: Joi.string().allow(null, ''),
        coverImage: Joi.string().allow(null, ''),
        twitterId: Joi.string().allow(null, ''),
        isTwitterToggled: Joi.number().allow(null, ''),
        instagramId: Joi.string().allow(null, ''),
        isInstagramToggled: Joi.number().allow(null, ''),
        tiktokId: Joi.string().allow(null, ''),
        isTikTokToggled: Joi.number().allow(null, ''),
        facebookId: Joi.string().allow(null, ''),
        isFacebookToggled: Joi.number().allow(null, ''),
        onlyfansId: Joi.string().allow(null, ''),
        isOnlyFansToggled: Joi.number().allow(null, ''),
        createdByAdmin: Joi.bool().allow(null, ''),
        nftCollection: Joi.array().items(Joi.string()).allow(null, ''),
        dial_code: Joi.string().allow(null, ''),
        comment: Joi.string().allow(null, ''),
        document_front: Joi.string().allow(null, ''),
        document_back: Joi.string().allow(null, ''),
        documentType: Joi.string().allow(null, ''),
      });

      const { error } = transSchema.validate(reqBody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  userNameValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let reqParam;
      reqParam = req.params;
      console.log('inside req.params', reqParam);
      transSchema = Joi.object({
        username: Joi.string().trim().required(),
      });

      const { error } = transSchema.validate(reqParam, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };

      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  paginationAnfFilterValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let transSchema2: any;
      let reqParam;
      let reqQuery;
      reqParam = req.params;
      console.log('inside req.params', reqParam);
      transSchema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number().required(),
        id: Joi.string().allow(null, ''),
      });
      if (req.query) {
        console.log('inside the query check.');
        reqQuery = req.query;
        console.log('inside req.query', reqQuery);
        transSchema2 = Joi.object({
          searchText: Joi.string().allow(null, ''),
          sortBy: Joi.string().allow(null, ''),
          Admin: Joi.bool().allow(null, ''),
          type: Joi.string().allow(null, ''),
          fromAdmin: Joi.bool().allow(null, ''),
          creatorId: Joi.string().allow(null, ''),
          year: Joi.string().allow(null, ''),
        });
      }

      const { error } = transSchema.validate(reqParam, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      if (req.query) {
        const { error } = transSchema2.validate(reqQuery, joiOptions.options);
        if (error)
          throw {
            message: joiOptions.capitalize(error.details[0].message),
          };
      }
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };

  addSumSubValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let reqbody;
      reqbody = req.body;
      transSchema = Joi.object({
        applicationId: Joi.string().required(),
        status: Joi.string().required(),
      });
      const { error } = transSchema.validate(reqbody, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
  paginationValidation = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      let transSchema: any;
      let reqParam;
      reqParam = req.params;
      transSchema = Joi.object({
        limit: Joi.number().required(),
        offset: Joi.number().required(),
        id: Joi.string().required(),
      });
      const { error } = transSchema.validate(reqParam, joiOptions.options);
      if (error)
        throw {
          message: joiOptions.capitalize(error.details[0].message),
        };
      return next();
    } catch (error: any) {
      console.log(error);
      return SetResponse.error(res, 401, {
        message: error.message,
        error: true,
      });
    }
  };
}

export default new ValidationHandler();
