import { PipeTransform, Injectable } from '@nestjs/common';
import { ObjectType } from '@/common/types/collection.type';

@Injectable()
export class SieveSort implements PipeTransform {
    transform(sorts: string): ObjectType {
        if (!sorts) return {}

        return sorts.split(',').filter((v): v is string => !!v).reduce<ObjectType>((result, sortKey) => {
            const key = this.getKey(sortKey)
            
            if (!key) return result;
            
            switch (sortKey.charAt(0)) {
                case "-": 
                    result[key] = "DESC";
                    break;
                
                case "+": 
                    result[key] = "ASC";
                    break;
                
                default: {
                    result[key] = "ASC"
                }
            }
            return result;
        }, {})
    }

    private getKey(sortKey: string): string {
        let key = sortKey.trim()
        
        if(key.charAt(0) == "+" || key.charAt(0) == "-") {
            key = key.substring(1);
        }

        const keyExtractor = new RegExp('([\\w\\d|-]+(?<![_-]))')
        
        const matches = keyExtractor.exec(key);
        
        if(!matches) return "";

        return matches[1];
    }
}