import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command, CopyObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';
import { FILE_UPLOADS_DIR } from './constants';

@Injectable()
export class ImageUploadService {
  private s3Client: S3Client;
  s3: any;

  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async uploadImageToS3(file: Express.Multer.File, bucketFolderName: string, folderPath: string) {
    const fileKey = `${bucketFolderName}/${folderPath}/${uuidv4()}_${file.originalname}`;
    
    const fileContent = fs.readFileSync(path.join(FILE_UPLOADS_DIR, file.filename));

    const uploadParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileContent,
      ContentType: file.mimetype,
    };

    await this.s3Client.send(new PutObjectCommand(uploadParams));
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;
  }

  // async deleteAssetFromS3(fileUrl: string) {
  //   const fileKey = fileUrl.split('.amazonaws.com/')[1];

  //   const deleteParams = {
  //     Bucket: process.env.AWS_S3_BUCKET_NAME,
  //     Key: fileKey,
  //   };

  //   await this.s3Client.send(new DeleteObjectCommand(deleteParams));
  //   return { message: 'File deleted successfully' };
  // }

  async deleteAssetFromS3(fileUrl: string) {
    if (!fileUrl) {
      throw new Error('File URL is required.');
    }
  
    console.log('Received fileUrl:', fileUrl);
  
    // Extract file key from the S3 URL
    const fileKey = fileUrl.split('.amazonaws.com/')[1];
  
    if (!fileKey) {
      throw new Error('Invalid file URL format.');
    }
  
    const deleteParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    };
  
    console.log('Deleting file with key:', fileKey);
  
    await this.s3Client.send(new DeleteObjectCommand(deleteParams));
    return { message: 'File deleted successfully' };
  }
  

  async listObjectsFromS3(bucket: string, prefix: string) {
    const listParams = {
      Bucket: bucket,
      Prefix: prefix,
    };

    const data = await this.s3Client.send(new ListObjectsV2Command(listParams));
    return data.Contents?.map((obj) => obj.Key) || [];
  }

  async copyObjectInS3(sourceKey: string, destinationKey: string) {
    const copyParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      CopySource: `/${process.env.AWS_S3_BUCKET_NAME}/${sourceKey}`,
      Key: destinationKey,
    };

    await this.s3Client.send(new CopyObjectCommand(copyParams));
    return { message: 'Object copied successfully' };
  }

  async generatePresignedUrlForS3(key: string) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key,
    };

    return await getSignedUrl(this.s3Client, new GetObjectCommand(params), { expiresIn: 3600 });
  }
}
