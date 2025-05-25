import AWS from 'aws-sdk';
import { S3_BUCKET } from 'src/config-global';


const s3 = new AWS.S3({
  accessKeyId: S3_BUCKET.accessKeyId,
  secretAccessKey: S3_BUCKET.secretAccessKey,
  endpoint: 'https://mysstore.fra1.digitaloceanspaces.com',
  region: S3_BUCKET.region,
  s3ForcePathStyle: true, // Required for DigitalOcean Spaces
});

export const uploadFile = async (file: Buffer, path: string, mimeType: string): Promise<string> => {
  const params = {
    Bucket: S3_BUCKET.name || '',
    Key: path,
    Body: file,
    ContentType: mimeType,
    ACL: 'public-read', // Grant public read access to the file
  };

  try {
    const data = await s3.upload(params).promise();
    return data.Location;
  } catch (error) {
    console.error('Error uploading file: ', error);
    throw new Error('Error uploading file');
  }
};


export const deleteFile = async (path: string): Promise<boolean> => {
  const params = {
    Bucket: S3_BUCKET.name || '',
    Key: path,
  };

  try {
    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 Deletion Error:', error);
    return false;
  }
};

// export 

export default s3;
