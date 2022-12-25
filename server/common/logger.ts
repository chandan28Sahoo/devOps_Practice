import pino from 'pino';
import CONFIG from '../api/config';
let today = new Date();
let date = today.getFullYear()+'_'+(today.getMonth()+1)+'_'+today.getDate();
const l = pino({
  // name: CONFIG.API.ID,
  level: CONFIG.API.LOG_LEVEL,
  prettyPrint: {
    colorize: true,
    translateTime: "yyyy-dd-mm, h:MM:ss TT",
  }
});

export default l;
