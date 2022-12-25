import dotenv from 'dotenv';
dotenv.config();
import multer = require('multer');
import aws = require('aws-sdk');
import multerS3 = require('multer-s3');
import { v4 } from 'uuid';
import config from '../config';
const watermark = require('image-watermark');

aws.config.update({
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  region: process.env.REGION,
});

const s3 = new aws.S3();
const imageFilter = (_req: any, file: any, cb: any) => {
  console.log(Number(process.env.MAX_UPLOAD_SIZE));
  console.log(_req.files);
  if (
    !file.originalname.match(/\.(JPG|jpg|jpeg|JPEG|PNG|png|GIF|gif|SVG|svg)$/)
  ) {
    return cb(new Error('Invalid Image Format!'), false);
  }
  cb(null, true);
};

const videoFilter = (_req: any, file: any, cb: any) => {
  console.log(Number(process.env.MAX_UPLOAD_SIZE));
  console.log(_req.files);
  if (
    !file.originalname.match(
      /\.(mp4|MP4|mkv|MKV|MOV|mov|AVI|avi|WMV|wmv|MPEG|mpeg)$/
    )
  ) {
    return cb(new Error('Invalid Image Format!'), false);
  }
  cb(null, true);
};

const waterMark = async (_req: any, file: any, cb: any) => {
  console.log(Number(process.env.MAX_UPLOAD_SIZE));
  console.log(_req.files);
  if (
    !file.originalname.match(/\.(JPG|jpg|jpeg|JPEG|PNG|png|GIF|gif|SVG|svg)$/)
  ) {
    return cb(new Error('Invalid Image Format!'), false);
  }
  const options = {
    text: 'sample watermark',
  };
  const useraaaaa = await watermark.embedWatermark(_req.files, options);
  console.log('useraaaaa===???', useraaaaa);
  cb(null, true);
};

export const gets3Instance = () => {
  return s3;
};

export const uploadSocialIcons = multer({
  fileFilter: imageFilter,
  limits: { fileSize: Number(process.env.MAX_UPLOAD_SIZE) },
  storage: multerS3({
    acl: 'public-read',
    s3,

    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=2592000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `${process.env.SOCIAL_ICON_DIR}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

export const uploadProfileImages = multer({
  fileFilter: imageFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,

    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=2592000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      file.originalname = file.originalname.split(' ').join('_');
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `${process.env.PROFILE_IMAGES}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

export const uploadNftImages = multer({
  fileFilter: imageFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,

    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=2592000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      file.originalname = file.originalname.split(' ').join('_');
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `${process.env.NFT_IMAGES}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

export const uploadNftWithWatermarkImages = multer({
  fileFilter: imageFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,

    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=2592000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      file.originalname = file.originalname.split(' ').join('_');
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `${process.env.NFT_WATER_MARK_IMAGES}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

export const uploadNftVideos = multer({
  fileFilter: videoFilter,
  // storage
  storage: multerS3({
    acl: 'public-read',
    s3,

    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${process.env.BUCKET}`,
    cacheControl: 'max-age=2592000',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      file.originalname = file.originalname.split(' ').join('_');
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `${process.env.NFT_VIDEOS}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();

const S3_BUCKET_KYC = config.S3.S3_BUCKET_KYC;
export const uploadKYC = multer({
  fileFilter: imageFilter,
  // storage
  storage: multerS3({
    s3,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    bucket: `${S3_BUCKET_KYC}`,
    cacheControl: 'max-age=2592000',
    serverSideEncryption: 'AES256',
    metadata: (_req: any, file: any, cb: any) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (_req: any, file: any, cb: any) => {
      file.originalname = file.originalname.split(' ').join('_');
      const fileSubsets = file.originalname.split('.');
      cb(
        null,
        `${process.env.KYC_FOLDER}/${v4.apply(file.originalname)}.${
          fileSubsets[fileSubsets.length - 1]
        }`
      );
    },
  }),
}).any();
