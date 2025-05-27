// import { Logger, Module, OnModuleInit } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { ImageUploadModule } from './upload/upload.module';
// import { MongodbUploadModule } from './mongodb-upload/mongodb-upload.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import mongoose from 'mongoose';

// @Module({
//   imports: [ConfigModule.forRoot({ isGlobal: true }), ImageUploadModule],
//   controllers: [AppController],
//   providers: [AppService],
// })
// // export class AppModule {}

// @Module({
//   imports: [
//     MongodbUploadModule,
//     MongooseModule.forRoot(process.env.MONGODB_URI), // Add connection string
//   ],
// })
// export class AppModule implements OnModuleInit {
//   private readonly logger = new Logger(AppModule.name);

//   async onModuleInit() {
//     try {
//       const connection = mongoose.connection;
//       connection.on('connected', () => {
//         this.logger.log('✅ MongoDB connected successfully');
//       });

//       connection.on('error', (err) => {
//         this.logger.error('❌ MongoDB connection error:', err);
//       });
//     } catch (error) {
//       this.logger.error('❌ Failed to set up MongoDB listeners:', error);
//     }
//   }
// }



// import { Logger, Module, OnModuleInit } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ConfigModule } from '@nestjs/config';
// import { ImageUploadModule } from './upload/upload.module';
// import { MongodbUploadModule } from './mongodb-upload/mongodb-upload.module';
// import { MongooseModule } from '@nestjs/mongoose';
// import mongoose from 'mongoose';

// @Module({
//   imports: [
//     ConfigModule.forRoot({ isGlobal: true }), // Load env variables
//     ImageUploadModule,
//     MongodbUploadModule,
//     MongooseModule.forRoot(process.env.MONGODB_URI), // fallback
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Logger, Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ImageUploadModule } from './s3-upload/upload.module';
import { MongodbUploadModule } from './mongodb-upload/mongodb-upload.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import mongoose from 'mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      storage: multer.memoryStorage(), // 🔧 Enables in-memory file upload
    }),
    ImageUploadModule,
    MongodbUploadModule,
    MongooseModule.forRoot(process.env.MONGODB_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
