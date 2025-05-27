import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoUploadService } from './mongodb-upload.service';
import { MongoUploadController } from './mongodb-upload.controller';
import { File, FileSchema } from './schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: File.name, schema: FileSchema }]),
  ],
  controllers: [MongoUploadController],
  providers: [MongoUploadService],
})
export class MongodbUploadModule {}
