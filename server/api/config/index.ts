// import zookeeper from '../../common/zookeeper';
import dotenv from 'dotenv';
dotenv.config();
export default {
  RUNNING_PORT: parseInt(process.env.PORT || '30022'),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  SENTRY_DSN: process.env.SENTRY_DSN,
  RABBITMQ_HOST: process.env.RABBITMQ_HOST || "amqp://guest:guest@localhost",
  GRPC: {
    NFT_CONTAINER_NAME: process.env.NFT_CONTAINER,
    NFT_CONTAINER_PORT: process.env.NFT_PORT,
    ADMIN_CONTAINER_NAME: process.env.ADMIN_CONTAINER,
    ADMIN_CONTAINER_PORT: process.env.ADMIN_PORT,
    CONTAINER_PORT_GRPC: process.env.CONTAINER_PORT_GRPC || '3002',
    CONTAINER_NAME_GRPC: process.env.CONTAINER_NAME_GRPC,
  },
  MYSQLDB: {
    HOST: process.env.DB_HOST,
    DATABASE_NAME: process.env.DB_NAME,
    USERNAME: process.env.DB_USERNAME,
    PASSWORD: process.env.DB_PASSWORD,
    PORT: process.env.DB_PORT || 3306,
  },
  EMAIL_CONFIG: {
    android_link: process.env.EMAIL_ANDROID_LINK,
    ios_link: process.env.EMAIL_IOS_LINK,
    source: process.env.EMAIL_SOURCE,
    NODE_MAILER_CONFIG: {
      service: 'ses',
      host: process.env.MAILER_HOST,
      port: parseInt(process.env.MAILER_PORT || '587'),
      secure: true,
      auth: {
        user: process.env.MAILER_AUTH_USER,
        pass: process.env.MAILER_AUTH_PASS,
      },
    },
  },
  SESSION: {
    SECRET: process.env.SESSION_SECRET,
  },
  JWT: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    REFRESH_TOKEN: process.env.JWT_REFRESH_SECRET,
    ISSUER: process.env.JWT_ISSUER,
    EXPIRES_IN: process.env.JWT_EXPIRES_IN, // default 30 days
  },
  TOKEN: {
    EXPIRY_TIME: parseInt(process.env.DB_TOKEN_EXPIRY_TIME || '30'),
    EMAIL_VERIFICATION_EXPIRY: parseInt(
      process.env.DB_TOKEN_EMAIL_VERIFICATION_EXPIRY || '7'
    ),
  },
  NODE_ENV: process.env.NODE_ENV,
  API: {
    ID: process.env.API_ID,
    SPEC: process.env.API_SPEC,
    LOG_LEVEL: process.env.API_LOG_LEVEL || 'trace',
    REQUEST_LIMIT: process.env.API_REQUEST_LIMIT,
    ENABLE_RESPONSE_VALIDATION: process.env.OPENAPI_ENABLE_RESPONSE_VALIDATION,
  },
  AUTH_LINK: {
    GET_GOOGLE_DATA: process.env.AUTH_GOOGLE_DATA_LINK,
    GET_FACEBOOK_DATA: process.env.AUTH_FACEBOOK_DATA_LINK,
  },
  WHITE_LIST_DOMAINS: [
    process.env.PROD_DOMAIN,
    process.env.PROD_ADMIN_DOMAIN,
    process.env.STAGE_DOMAIN,
    process.env.STAGE_ADMIN_DOMAIN,
    process.env.LOCAL_DOMAIN,
    process.env.LOCAL_DOMAIN2,
  ],
  IMAGEKIT_URL: process.env.IMAGE_KIT_URL,
  S3: {
    S3_REGION: process.env.REGION,
    S3_BUCKET: process.env.BUCKET,
    S3_BUCKET_KYC: process.env.KYC_BUCKET,
  },
  PAYPAL: {
    MODE: process.env.PAYPAL_MODE,
    CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    SECRET_ID: process.env.PAYPAL_SECRET_ID,
    SUCCESS: process.env.PAYPAL_SUCCESS,
    CANCEL: process.env.PAYPAL_CANCEL,
  },
  WATER_MARK_LOGO: process.env.WATER_MARK_LOGO,
  NFT: {
    CONTAINER_NAME: process.env.NFT_CONTAINER,
    PORT_NUMBER: process.env.NFT_PORT,
  },
  CREATOR_NAME: process.env.CREATOR_NAME,
  ADMIN: {
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_USER_ID: process.env.ADMIN_USERID,
    ADMIN_FULL_NAME: process.env.ADMIN_FULL_NAME
  },
  STUDENT: {
    STUDENT_CONTAINER_NAME: process.env.STUDENT_CONTAINER,
    STUDENT_CONTAINER_PORT: process.env.STUDENT_PORT,
  }
};
