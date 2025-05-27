// src/mongodb-upload/schemas/file.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FileDocument = File & Document;

@Schema()
export class File {
  @Prop()
  filename: string;

  @Prop()
  contentType: string;

  @Prop()
  length: number;

  @Prop()
  uploadDate: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
