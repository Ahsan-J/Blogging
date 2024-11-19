import { createCipheriv, scryptSync, createDecipheriv, createHmac } from 'crypto';

export class Crypto {

    constructor(private readonly salt: string) { }

    public encryptText = (value: string): string => {
        const iv = Buffer.alloc(16, 0);
        const key = scryptSync(this.salt, 'salt', 24) as Buffer;
        const cipher = createCipheriv('aes-192-cbc', key, iv);
        const encryptedText = Buffer.concat([cipher.update(value), cipher.final()]);
        return encryptedText.toString('hex')
    }

    public decryptText = (value: string,): string => {
        const iv = Buffer.alloc(16, 0);
        const key = scryptSync(this.salt, 'salt', 24) as Buffer;
        const decipher = createDecipheriv('aes-192-cbc', key, iv);
        const decryptedText = decipher.update(value, 'hex', 'utf8') + decipher.final('utf8');
        return decryptedText;
    }

    public getTextHash = (text: string = ""): string => {
        return createHmac('sha256', this.salt)
            .update(text)
            .digest('hex');
    }
}

