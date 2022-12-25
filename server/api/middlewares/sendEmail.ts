import nodeMailer from 'nodemailer';
import userHelper from '../helpers/user.helper';
const ejs = require('ejs');
const fs = require('fs');

const MAILERCONFIG = {
  host: process.env.NODE_MAILER_HOST as string,
  port: Number(process.env.NODE_MAILER_PORT),
  auth: {
    user: process.env.NODE_MAILER_USER,
    pass: process.env.NODE_MAILER_PASS,
  },
};
const transporter = nodeMailer.createTransport(MAILERCONFIG);
export class SendEmail {

  // Email while block user ///
  sendUserEmail = async (userId: string, isActive: number): Promise<any> => {
    try {

      // let userError: boolean = true

      const userExist: any = await userHelper.userById(userId);
      // console.log("___________@@@@@nftExist-------",userExist);

      if (userExist.data > 0) {
        let nftError: any = false
      }

      const filePath = `${process.cwd()}/server/api/middlewares/emailTemplate/userEnableDisable.ejs`;
      let userText = "";
      if (isActive == 0) { userText = "Blocked" } else { userText = "Unblocked" }


      const details: any = {
        username: `Hi ${userExist?.data?.fullname}`,
        message: `You have been ${userText} by the admin. Please contact admin for further details.`,
        support_url: process.env.SITE_URL_SUPPORT,
        blockUrl: process.env.CONTACT_US,
      };
      // console.log("@@@!!!!!!!!!!!@@@details-------",details);

      const htmlDetails: any = await ejs.renderFile(filePath, details, {
        async: true,
      });

      const mailOptions = {
        from: `${process.env.FROM_WEBSITE_NAME} <${process.env.FROM_EMAIL_ADDRESS}>`, // sender address
        to: `${userExist?.data?.fullname} <${userExist?.data?.email}>`, // list of receivers
        bcc: process.env.ADMIN_EMAIL,
        subject: `${userText}!!`, // Subject line
        html: htmlDetails,
      };
      console.log("@@@mailOptions---", mailOptions);

      let responseEmail = await transporter.sendMail(mailOptions);
      console.log(responseEmail, "Email send Response")
      return {
        message: 'Success Email',
        error: false,
      };

    } catch (error: any) {
      console.log(error, 'getNFT: ');
      return {
        message: error.message,
        error: true,
      };
    }
  };
}



export default new SendEmail();