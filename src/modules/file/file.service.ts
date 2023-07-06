import { Injectable } from '@nestjs/common';
import * as fs from 'fs';

import { FileEntity } from './file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly fileRepository: Repository<FileEntity>,
  ) {}

  async uploadFile(file: Express.Multer.File, request) {
    const url =
      request.protocol +
      '://' +
      request.hostname +
      ':4000' +
      file.path.split('uploads')[1];
    const path = file.path;

    const newFile = this.fileRepository.create({ url, path });

    return await this.fileRepository.save(newFile);
  }

  async removeFile(id: string) {
    const file = await this.fileRepository.findOne({ where: { id } });
    if (file.path) {
      await this.deleteFileWithFs(file.path);
    }
    await this.fileRepository.delete(id);
  }

  async updateFile(id: string, file: Express.Multer.File, request) {
    const changedFile = await this.fileRepository.findOne({ where: { id } });

    if (changedFile.path) {
      await this.deleteFileWithFs(changedFile.path);
    }

    const url =
      request.protocol +
      '://' +
      request.hostname +
      ':4000' +
      file.path.split('uploads')[1];
    const path = file.path;

    await this.fileRepository.update({ id }, { url, path });

    return await this.fileRepository.findOne({ where: { id } });
  }

  async deleteFileWithFs(path) {
    try {
      return fs.unlink(path, (err) => {
        if (err) console.log(err);
      });
    } catch (err) {
      console.log(err);
    }
  }
}
