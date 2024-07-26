import AWS from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

export const uploadFile = (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    Acl: 'public-read',
  };
//   console.log(params);
return s3.upload(params).promise()
.then((data) => {
  console.log('Upload successful:', data);
  return data;
})
.catch((err) => {
  console.error('Upload error:', err);
  throw err;
});
};
