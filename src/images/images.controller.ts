import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Res,
  Param,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import * as path from 'path';

export const storage = {
  storage: diskStorage({
    destination: './uploads',
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
  }),
};

@Controller('images')
export class ImagesController {
  @Post('/image')
  @UseInterceptors(FileInterceptor('image', storage))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
  ) {
    console.log(file);
  }

  @Get('/uploads/:fileName')
  getImage(@Param('fileName') fileName: string, @Res() res) {
    const imagePath = path.join(process.cwd(), 'uploads/' + fileName);
    if (imagePath) {
      res.sendFile(join(process.cwd(), 'uploads/' + fileName));
    }
    res.send({ status: 'error' });
  }
}
