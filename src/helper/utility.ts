import { createCipheriv, scryptSync, createDecipheriv } from 'crypto';
import { diskStorage } from 'multer';
import { nanoid } from 'nanoid';
import fs from 'fs';
import { join } from 'path';

export const encryptText = (value: string, keyString: string = process.env.APP_ID): string => {
    const iv = Buffer.alloc(16, 0);
    const key = scryptSync(keyString, 'salt', 24) as Buffer;
    const cipher = createCipheriv('aes-192-cbc', key, iv);
    const encryptedText = Buffer.concat([cipher.update(value), cipher.final()]);
    return encryptedText.toString('hex')
}

export const decryptText = (value: string, keyString: string = process.env.APP_ID): string => {
    const iv = Buffer.alloc(16, 0);
    const key = scryptSync(keyString, 'salt', 24) as Buffer;
    const decipher = createDecipheriv('aes-192-cbc', key, iv);
    const decryptedText = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
    return decryptedText;
}

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