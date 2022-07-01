import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Upload } from './upload.model';
import { UploadController } from './upload.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Upload', schema: Upload }])],
  providers: [UploadService],
  exports: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
