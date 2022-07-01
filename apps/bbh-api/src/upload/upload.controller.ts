/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  UseGuards,
  UseInterceptors,
  Req,
  UploadedFiles,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ACGuard, UseRoles } from 'nest-access-control';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { UploadService, IGenericMessageBody } from './upload.service';
import type { IUpload } from './upload.model';
import { FilterUploadsPayload } from './payload/filter.uploads.payload';
import { FastifyFilesInterceptor } from '../interceptors/fastify-files-interceptor';
import { diskStorage } from 'multer';
import { editFileName, imageFileFilter } from '../utils/file-upload-util';
import { CreateUploadPayload } from './payload/create.upload.payload';

/**
 * Upload Controller
 */
@ApiBearerAuth()
@ApiTags('upload')
@Controller('api/upload')
export class UploadController {
  /**
   * Constructor
   * @param uploadService
   */
  constructor(private readonly uploadService: UploadService) {}

  /**
   * Retrieves a particular upload
   * @param id the upload given uploadname to fetch
   * @returns {Promise<IUpload>} queried upload data
   */
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({ status: 200, description: 'Fetch Upload Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Upload Request Failed' })
  async getUpload(@Param('id') id: string): Promise<IUpload> {
    const upload = await this.uploadService.getById(id);
    if (!upload) {
      throw new BadRequestException(
        'The upload with that uploadname could not be found.'
      );
    }
    return upload;
  }

  /**
   * Retrieves a upload list
   * @param {FilterUploadsPayload} payload
   * @returns {Promise<IUpload[]>} queried upload data
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseRoles({
    resource: 'uploads',
    action: 'read',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Fetch Uploads Request Received' })
  @ApiResponse({ status: 400, description: 'Fetch Uploads Request Failed' })
  async getUploads(
    @Body() payload: FilterUploadsPayload
  ): Promise<{ uploads: IUpload[]; count: number }> {
    const { search, sortby, order, offset, limit } = payload;
    const uploads = await this.uploadService.getUploadList(
      search,
      sortby,
      order,
      offset,
      limit
    );
    const count = await this.uploadService.getUploadCount(search);
    if (!uploads) {
      throw new BadRequestException(
        'The upload with that uploadname could not be found.'
      );
    }
    return { uploads, count };
  }

  /**
   * create upload
   * @param {CreateUploadPayload} payload the upload dto
   */
  @ApiConsumes('multipart/form-data')
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UseRoles({
    resource: 'uploads',
    action: 'update',
    possession: 'any',
  })
  @UseInterceptors(
    FastifyFilesInterceptor('photo_url', 10, {
      storage: diskStorage({
        destination: './upload/images',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    })
  )
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async uploadFile(
    @Req() req: Request,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: CreateUploadPayload
  ) {
    return await this.uploadService.create({ files, body });
  }

  /**
   * Removes a upload from the database
   * @param {string} id the id to remove
   * @returns {Promise<IGenericMessageBody>} whether or not the upload has been deleted
   */
  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), ACGuard)
  @UseRoles({
    resource: 'uploads',
    action: 'delete',
    possession: 'any',
  })
  @ApiResponse({ status: 200, description: 'Delete Upload Request Received' })
  @ApiResponse({ status: 400, description: 'Delete Upload Request Failed' })
  async delete(@Param('id') id: string): Promise<IGenericMessageBody> {
    return await this.uploadService.delete(id);
  }
}
