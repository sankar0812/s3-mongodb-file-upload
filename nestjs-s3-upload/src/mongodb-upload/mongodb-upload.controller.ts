import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, Delete } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MongoUploadService } from './mongodb-upload.service';
import { Response } from 'express';

@Controller('mongo-upload')
export class MongoUploadController {
  constructor(private readonly mongoUploadService: MongoUploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    return await this.mongoUploadService.uploadFile(file);
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const fileBuffer = await this.mongoUploadService.getFile(id);
    res.send(fileBuffer);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    return await this.mongoUploadService.deleteFile(id);
  }

  @Get()
  async listFiles() {
    return await this.mongoUploadService.listFiles();
  }
}
