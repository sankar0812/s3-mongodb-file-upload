import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Get,
    Delete,
    Headers,
    Patch,
    Body,
    Param,
    BadRequestException,
    Query,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ImageUploadService } from './upload.service';
  import { FILE_UPLOADS_DIR } from './constants';
  import { diskStorage } from 'multer';
  import { fileNameEditor, imageFileFilter } from './upload.utils';
  
  @Controller('file')
  export class ImageUploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}
  
    @Post('upload')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          filename: fileNameEditor,
          destination: FILE_UPLOADS_DIR,
        }),
        limits: {
          fileSize: 1024 * 1024 * 3, // 3MB limit
        },
        fileFilter: imageFileFilter,
      }),
    )
    async uploadImage(@UploadedFile() file: Express.Multer.File, @Body() body) {
      const { bucketFolderName, folderPath } = body;
      return await this.imageUploadService.uploadImageToS3(file, bucketFolderName, folderPath);
    }
  
    // @Delete('delete-asset')
    // async deleteAsset(@Headers('url') url: string) {
    //   return await this.imageUploadService.deleteAssetFromS3(url);
    // }
    // @Delete('delete-asset')
    // async deleteAsset(@Headers('url') url: string) {
    //    console.log('Received URL in header:', url); // Debugging log
    //    if (!url) {
    //     throw new BadRequestException('The "url" header is required.');
    //   }
    //   return await this.imageUploadService.deleteAssetFromS3(url);
    // }
@Delete('delete-asset')
async deleteAsset(@Query('url') url: string) {
  console.log('Received URL in query param:', url); // Should print the full encoded S3 URL

  if (!url) {
    throw new BadRequestException('The "url" query parameter is required.');
  }
  return await this.imageUploadService.deleteAssetFromS3(url);
}


    
    
    // @Get('list-objects')
    // async getObjects(@Headers() headers) {
    //   const { bucket, prefix } = headers;
    //   return await this.imageUploadService.listObjectsFromS3(bucket, prefix);
    // }
    @Get('list-objects/:bucketName')
    async getObjects(@Param('bucketName') bucketName: string, @Headers() headers) {
        const prefix = headers.prefix || ''; // Optional prefix from headers
        return await this.imageUploadService.listObjectsFromS3(bucketName, prefix);
    }
 
  
    @Patch('transfer-object')
    async transferObject(@Headers() headers) {
      const { sourceKey, destinationKey } = headers;
      return await this.imageUploadService.copyObjectInS3(sourceKey, destinationKey);
    }
  
    @Get('presigned-url')
    async generatePresignedUrl(@Headers('key') key: string) {
      return await this.imageUploadService.generatePresignedUrlForS3(key);
    }
  }
  