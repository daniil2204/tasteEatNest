import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  Res,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { ImagesService } from './images.service';

export const dishStorage = {
  storage: diskStorage({
    destination: './uploads/dishes',
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  }),
};

@Controller('images')
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}
  @Post()
  @UseInterceptors(FilesInterceptor('image', 10, dishStorage))
  async uploadFiles(
    @UploadedFiles(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.imageService.getUrls(files);
  }

  @Get('/uploads/dishes/:fileName')
  async getDishImage(@Param('fileName') imageName: string, @Res() res) {
    const path = await this.imageService.getImageByName(imageName);
    if (path === 'NotFound') {
      res.sendStatus(HttpStatus.NOT_FOUND);
    } else {
      res.sendFile(path);
    }
  }
}
