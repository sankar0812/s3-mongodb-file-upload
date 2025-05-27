import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';

@Injectable()
export class MongoUploadService implements OnModuleInit {
  private client: MongoClient;
  private bucket: GridFSBucket;

  async onModuleInit() {
    this.client = new MongoClient('mongodb://admin:Torus%40123@192.168.2.165:32017/Torus9x?directConnection=true&authSource=admin'); // use your DB URL
    await this.client.connect();
    const db = this.client.db('mongodb-upload');
    this.bucket = new GridFSBucket(db, { bucketName: 'uploads' });
  }

  async uploadFile(file: Express.Multer.File) {
    const uploadStream = this.bucket.openUploadStream(file.originalname);
    uploadStream.end(file.buffer); // assumes Multer memory storage
    return { message: 'File uploaded successfully', fileId: uploadStream.id };
  }

  async getFile(id: string) {
    return this.bucket.openDownloadStream(new ObjectId(id));
  }

  async deleteFile(id: string) {
    await this.bucket.delete(new ObjectId(id));
    return { message: 'File deleted successfully' };
  }

  async listFiles() {
    const files = await this.bucket.find().toArray();
    return files;
  }
}
