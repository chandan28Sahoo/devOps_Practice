import { NextFunction, Request, Response } from 'express';
// import sequelize from '../../db/connection';
import console = require('console');



export class Controller {
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
