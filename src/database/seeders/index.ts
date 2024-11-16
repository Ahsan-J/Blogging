/* eslint-disable no-console */
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

export async function seedData() {
    const files = fs.readdirSync(path.resolve(process.cwd(), "src", "seed")).filter(v => !v.includes('index'));
    
    console.log(`Connecting to mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`);
    
    // Registering entities
    const entities = [];
    for(let i = 0; i < files.length; i++) {
        const file = files[i];

        const { entities:moduleEntity } = await import(`./${file}`);

        if(moduleEntity && moduleEntity.length > 0) {
            entities.push(...moduleEntity)
        }
    }

    const AppDataSource = new DataSource({
        "type": "mysql",
        "host": process.env.DATABASE_HOST,
        "port": parseInt(process.env.DATABASE_PORT || "3306"),
        "username": process.env.DATABASE_USER,
        "password": process.env.DATABASE_PASS,
        "database": process.env.DATABASE_NAME,
        entities,
    })

    await AppDataSource.initialize()

    files.forEach(async file => {
        const { seed } = await import(`./${file}`);
        if (!seed) {
            return console.log(`file: ${file} doesn't include the "seed" function`);
        }

        seed(AppDataSource);
    });
}

seedData();