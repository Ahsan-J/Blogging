import { ValueTransformer } from 'typeorm';
import { ObjectType } from '../types/collection.type';
import { Logger } from '@nestjs/common';

export class MetaKeywordTransformer implements ValueTransformer {

    private logger = new Logger(MetaKeywordTransformer.name);

  to(value: ObjectType<string | number>): string | null {
    if (value === null || value === undefined) {
      return null;
    }
    
    try {
      return JSON.stringify(value);
    } catch (error) {
      this.logger.error('Error converting to JSON:', error);
      throw error;
    }
  }

  from(value: string): ObjectType<string> | null {
    if (value === null || value === undefined) {
      return null;
    }
    
    try {
      return JSON.parse(value);
    } catch (error) {
      this.logger.error('Error parsing JSON:', error);
      throw error;
    }
  }
}