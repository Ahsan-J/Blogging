import { ValueTransformer } from 'typeorm';
import { ObjectType } from '../types/collection.type';
import { Logger } from '@nestjs/common';

export class JsonTransformer implements ValueTransformer {

  private logger = new Logger(JsonTransformer.name);

  to(value: ObjectType<string | number>): string | undefined {
    if (!value) {
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
    try {
      return JSON.parse(value);
    } catch (error) {
      this.logger.error('Error parsing JSON:', error);
      throw error;
    }
  }
}