import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import { join } from 'path';
import { Request } from 'express';

export class StorageGenerator {
    constructor(
        private path: string | {[fieldname in string] : string}
    ) {}

    private destination(req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        let destPath = "./uploads";
        
        if(this.path && typeof this.path == "string") {
            destPath = `./uploads/${this.path}`;
        }
        
        if(typeof this.path == "object" && Object.keys(this.path).filter(v=>v).length > 0 && file.fieldname) {
            destPath = `./uploads/${this.path[file.fieldname]}`;
        }

        if(!fs.existsSync(join(process.cwd(), destPath))) {
            fs.mkdirSync(join(process.cwd(), destPath));
        }

        return cb(null, destPath);
    }

    private filename (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
        const fileId = nanoid();
        const ext = file.originalname.split('.').pop();
        return cb(null, `${fileId}.${ext}`);
    }

    public getStorage() {
        return diskStorage({
            destination: this.destination,
            filename: this.filename
        })
    }
}