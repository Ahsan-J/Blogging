import { ValueTransformer } from 'typeorm';
import { ObjectType } from '../types/collection.type';
import { Logger } from '@nestjs/common';

export class JsonTransformer implements ValueTransformer {

  private logger = new Logger(JsonTransformer.name);

  to(value?: ObjectType<string | number>): string | undefined {
    if (!value || Object.keys(value).length == 0) {
      return undefined;
    }

    try {
      return JSON.stringify(value);
    } catch (error) {
      this.logger.error('Error converting to JSON:', error);
      throw error;
    }
  }

  from(value: string): ObjectType<string> | undefined {
    if (!value) {
      return undefined;
    }
    if(typeof value == 'object') return value
    try {
      return JSON.parse(value);
    } catch (error) {
      this.logger.error('Error parsing JSON:',value, typeof value ,error);
      throw error;
    }
  }
}