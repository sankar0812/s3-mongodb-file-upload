import { Module } from '@nestjs/common';
import { ImageUploadController } from './upload.controller';
import { ImageUploadService } from './upload.service';

@Module({
  controllers: [ImageUploadController],
  providers: [ImageUploadService],
})
export class ImageUploadModule {}
