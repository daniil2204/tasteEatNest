import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { ImgFoundType } from 'types/images';

@Injectable()
export class ImagesService {
  getUrls(files: Express.Multer.File[]) {
    const urls = files.map(
      (file) =>
        `${process.env.DOMAIN}images/uploads/dishes/${file.originalname}`,
    );
    return urls;
  }
  async getImageByName(imageName: string) {
    const isExist = await this.checkIsExist(`uploads/dishes/${imageName}`);
    return isExist.found ? isExist.imgPath : 'NotFound';
  }
  async checkIsExist(imgName: string): Promise<ImgFoundType> {
    const imgPath = path.join(process.cwd(), imgName);
    const res = {
      imgPath,
      found: false,
    };
    try {
      await fs.promises.access(imgPath, fs.constants.F_OK);
      res.found = true;
      return res;
    } catch (err) {
      return res;
    }
  }
}
