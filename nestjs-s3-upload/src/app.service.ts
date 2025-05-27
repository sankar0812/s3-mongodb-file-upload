import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class AppService {
  logger: any;
  getHello(): string {
    return 'Hello World!';
  }
}
