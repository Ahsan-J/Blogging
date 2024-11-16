/* eslint-disable no-console */

import { stringToColor } from "./string.utility";

export class Logger {

    constructor(private key: string = "") { }

    log(key: string | TemplateStringsArray, ...data: Array<unknown>) {
        if (process.env.NODE_ENV !== 'development') return;
        const k: string = Array.isArray(key) ? key.filter(v => v).join(",") : key as string;
        const randomColor = stringToColor(k);
        console.log(`%c${k}`, `background-color:${randomColor};color: #fff; padding: 0.2rem 0.4rem;border-radius: 0.3rem;font-size: 0.7rem;font-weight: bold;`, ...data);
    }

    error(key: string | TemplateStringsArray, ...data: Array<unknown>) {
        // if(process.env.NODE_ENV !== 'development') return;
        const k: string = Array.isArray(key) ? key.filter(v => v).join(",") : key as string;
        console.error(`%c${k}`, "background-color:#cf3917;color: #fff; padding: 0.2rem 0.4rem;border-radius: 0.3rem;font-size: 0.7rem;font-weight: bold;", ...data);
    }

    warn(key: string | TemplateStringsArray, ...data: Array<unknown>) {
        if (process.env.NODE_ENV !== 'development') return;
        const k: string = Array.isArray(key) ? key.filter(v => v).join(",") : key as string;
        console.warn(`%c${k}`, "background-color:#f7df1e;color: #25272d; padding: 0.2rem 0.4rem;border-radius: 0.3rem;font-size: 0.7rem;font-weight: bold;", ...data);
    }

    time(id?: string) {
        if (process.env.NODE_ENV !== 'development') return () => null;
        console.time(id);
        return () => {
            console.timeEnd(id);
        }
    }
}