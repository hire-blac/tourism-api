require('dotenv').config();
const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');

const bucketName = process.env.BUCKET_NAME;
const region = process.env.BUCKET_REGION;
const accessKeyId = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_KEY;

// create s3 bucket object
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

// upload file to s3
const uploadFile = file => {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename
  }

  return s3.upload(uploadParams).promise()
}

// download a file from s3
const downloadFile = fileKey => {
  const downloadParams = {
    key: fileKey,
    Bucket: bucketName
  }

  return s3.getObject(downloadParams).createReadStream()
}

// export modules
module.exports = {
  uploadFile, downloadFile
}
