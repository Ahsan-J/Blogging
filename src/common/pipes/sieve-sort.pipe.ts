import { PipeTransform, Injectable } from '@nestjs/common';
import { ObjectType } from '../types/collection.type';

@Injectable()
export class SieveSort implements PipeTransform {
    transform(sorts: string): ObjectType {
        if (!sorts) return {}

        return sorts.split(',').filter((v): v is string => !!v).reduce<ObjectType>((result, sortKey) => {
            switch (sortKey.charAt(0)) {
                case "-":
                    result[sortKey.substring(1)] = "DESC";
                    break;
                case "+":
                    result[sortKey.substring(1)] = "ASC"
                    break;
                default:
                    result[sortKey] = "ASC"
            }
            return result;
        }, {})
    }
}