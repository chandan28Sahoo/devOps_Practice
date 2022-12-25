import express from 'express';
import controller from '../api/controllers/users/controller';


export default express
  .Router()
  .get("/",controller.authUser);
 
