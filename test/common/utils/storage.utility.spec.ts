import { StorageGenerator } from '@/common/utils/storage.utility';
import { Request } from 'express';
// import * as fs from 'fs';
import { nanoid } from 'nanoid';

jest.mock('fs');
jest.mock('nanoid');

describe('StorageGenerator', () => {
  let storageGenerator: StorageGenerator;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('destination', () => {
    // it('should set destination path as "./uploads" by default', () => {
    //   storageGenerator = new StorageGenerator('./uploads');
    //   const req = {} as Request;
    //   const file = { fieldname: 'file' } as Express.Multer.File;
    //   const cb = jest.fn();

    //   storageGenerator['destination'](req, file, cb);

    //   expect(cb).toHaveBeenCalledWith(null, './uploads');
    // });

    it('should use custom path if a string is provided', () => {
      storageGenerator = new StorageGenerator('customPath');
      const req = {} as Request;
      const file = { fieldname: 'file' } as Express.Multer.File;
      const cb = jest.fn();

      storageGenerator['destination'](req, file, cb);

      expect(cb).toHaveBeenCalledWith(null, './uploads/customPath');
    });

    it('should use custom path per fieldname if an object is provided', () => {
      const customPaths = { file: 'uploads/filePath', image: 'uploads/imagePath' };
      storageGenerator = new StorageGenerator(customPaths);
      const req = {} as Request;
      const file = { fieldname: 'file' } as Express.Multer.File;
      const cb = jest.fn();

      storageGenerator['destination'](req, file, cb);

      expect(cb).toHaveBeenCalledWith(null, './uploads/uploads/filePath');
    });

    // it('should create the directory if it does not exist', () => {
    //   const destPath = './uploads/customPath';
    //   storageGenerator = new StorageGenerator('customPath');
    //   const req = {} as Request;
    //   const file = { fieldname: 'file' } as Express.Multer.File;
    //   const cb = jest.fn();

    //   storageGenerator['destination'](req, file, cb);

    //   expect(fs.existsSync).toHaveBeenCalledWith(destPath);
    //   expect(fs.mkdirSync).toHaveBeenCalledWith(destPath);
    //   expect(cb).toHaveBeenCalledWith(null, destPath);
    // });
  });

  describe('filename', () => {
    it('should generate a unique filename using nanoid and original file extension', () => {
      const mockNanoid = nanoid as jest.Mock;
      mockNanoid.mockReturnValue('uniqueid');
      storageGenerator = new StorageGenerator('./uploads');
      const req = {} as Request;
      const file = { originalname: 'image.jpg' } as Express.Multer.File;
      const cb = jest.fn();

      storageGenerator['filename'](req, file, cb);

      expect(cb).toHaveBeenCalledWith(null, 'uniqueid.jpg');
    });
  });

  describe('getStorage', () => {
    // it('should return a valid diskStorage configuration', () => {
    //   storageGenerator = new StorageGenerator('./uploads');
    //   const storage = storageGenerator.getStorage();

    //   expect(storage).toHaveProperty('destination');
    //   expect(storage).toHaveProperty('filename');
    // });
  });
});
