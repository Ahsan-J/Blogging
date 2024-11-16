import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import { join } from 'path';

export const getStorage = (path: string | {[fieldname in string] : string}) => diskStorage({
    // destination: `./uploads${path ? "/" + path : ""}`,
    destination: (req, file, cb) => {
        let destPath = "./uploads";
        
        if(path && typeof path == "string") {
            destPath = `./uploads/${path}`;
        }
        
        if(typeof path == "object" && Object.keys(path).filter(v=>v).length > 0 && file.fieldname) {
            destPath = `./uploads/${path[file.fieldname]}`;
        }

        if(!fs.existsSync(join(process.cwd(), destPath))) {
            fs.mkdirSync(join(process.cwd(), destPath));
        }

        return cb(null, destPath);
    },
    filename: (req, file, cb) => {
        const fileId = nanoid();
        const ext = file.originalname.split('.').pop();
        return cb(null, `${fileId}.${ext}`);
    }
});