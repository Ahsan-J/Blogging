import { PipeTransform, Injectable } from '@nestjs/common';
import { Equal, FindOperator, ILike, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not, Raw } from 'typeorm';
import { ObjectType } from '@/common/types/collection.type';

@Injectable()
export class SieveFilter implements PipeTransform<string, Array<ObjectType<FindOperator<unknown> | string>>> {

    private filterOp: Record<string, <T>(value: T | FindOperator<T>) => (T | FindOperator<T> | FindOperator<string>)> = {
        "@==": <T>(value: T | FindOperator<T>) => Raw(alias => `MATCH(${alias}) AGAINST ('${value}*' IN BOOLEAN MODE)`),
        "@=*": <T>(value: T | FindOperator<T>) => ILike(`%${value}%`),
        "@=": <T>(value: T | FindOperator<T>) => Like(`%${value}%`),
        "==*": <T>(value: T | FindOperator<T>) => value,
        "==": Equal,
        "!=*": <T>(value: T | FindOperator<T>) => value, // Not Supported
        "!=": Not,
        ">=": MoreThanOrEqual,
        ">": MoreThan,
        "<=": LessThanOrEqual,
        "<": LessThan,
        "_=*": <T>(value: T | FindOperator<T>) => ILike(`${value}%`),
        "_=": <T>(value: T | FindOperator<T>) => Like(`${value}%`),
        "!@=*": <T>(value: T | FindOperator<T>) => Not(ILike(`%${value}%`)),
        "!@=": <T>(value: T | FindOperator<T>) => Not(Like(`%${value}%`)),
        "!_=*": <T>(value: T | FindOperator<T>) => Not(ILike(`${value}%`)),
        "!_=": <T>(value: T | FindOperator<T>) => Not(Like(`${value}%`)),
    }

    private nullFilterOp: Record<string, <T = unknown>() => FindOperator<T>> = {
        "==": IsNull,
        "!=": () => Not(IsNull())
    }

    private reg = new RegExp(`([\\w\\d|-]+(?<![_-]))(${Object.keys(this.filterOp).join("|")})([\\w\\d|-]*(?<![_-]))`);

    private processFilterValue = (op: string, value: string):  string | FindOperator<string> => {
        if(value && value.toLowerCase() != "null") { // perform sieve operation
            const f = this.filterOp[op];
            return f?.(value)
        } else { // Generate where clause for null
            const f = this.nullFilterOp[op] || this.nullFilterOp['==']
            return f();
        }
    }

    transform(filters: string): Array<ObjectType<FindOperator<string> | string>> {
        if(!filters) return [];

        return filters.split(',')
        .reduce<Array<ObjectType<FindOperator<string> | string>>>((result, expression) => {
            const matches = this.reg.exec(expression)
            
            if(!matches) return result;

            const [, key, op, value] = matches;
            
            const keys = key.split('|');
            
            const values = value.split('|');
            
            if(keys.length <= 1 && values.length <= 1) {
                result[0][key] = this.processFilterValue(op, value);
            } else {
                keys.forEach((k) => {
                    values.forEach((v) => {
                        result.push({[k]: this.processFilterValue(op, v)})
                    })
                })
            }
            
            return result;
        }, [{}]).filter(obj => Object.values(obj).length)
    }

}