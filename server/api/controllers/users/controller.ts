import { NextFunction, Request, Response } from 'express';
import sequelize from '../../db/connection';
const { QueryTypes } = require('sequelize');
import SetResponse from '../../response/response.helper';
import * as Interfaces from '../../interfaces';
import { RESPONSES } from '../../constant/response';
import { MESSAGES } from '../../constant/response.messages';
import TokenHandler from '../../middlewares/jwt.helper';
// import UserHelper from '../../helpers/user.helper';
import nodeMailer from 'nodemailer';
import l from '../../../common/logger';
import CONFIG from '../../config';
const ejs = require('ejs');
import AWS = require('aws-sdk');
// import RedisHelper from '../../services/redis.service';
import axios from 'axios';
import { v4 } from 'uuid';
import { gets3Instance } from '../../middlewares/filesProvider';
// import Validation from '../../middlewares/validation.helper';
import console = require('console');
// import followerHelper from '../../helpers/follower.helper';
import jwt from 'jsonwebtoken';
import UsersModel from '../../models/Users.model';
// import RabbitMq from '../../helpers/rabbitmq.helper';

// const {
//   // NFTClient: nftClient,
//   userClient,
//   ADMINClient,
// } = require('../../../../client/client.js');
// var watermark = require('image-watermark');
const watermark = require('jimp-watermark');

const fs = require('fs');
const path = require('path');
const {
  StudentClient
} = require('../../../../proto/client.js');
// console.log("StudentClient",StudentClient);


const MAILERCONFIG = {
  host: process.env.NODE_MAILER_HOST as string,
  port: Number(process.env.NODE_MAILER_PORT),
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
};
const transporter = nodeMailer.createTransport(MAILERCONFIG);

export class Controller {
  private generateWaterMark = false;
  constructor() { }
  //============== Web3 Auth Signup/Login ====================
  authUser =async (_req:Request,res:Response) => {
    try {
      console.log("hello from server");
      res.send({
        erro: false,
        message:"hello"
      })
    } catch (error:any) {
      res.send({
        erro: true,
        message:error.message
      })
    }
  }
}
export default new Controller();
