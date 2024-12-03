import { ICacheManager } from "@/common/interface/cache-manager.interface"
import { ObjectType } from "@/common/types/collection.type";

export class LRUCacheManager<T extends ObjectType> implements ICacheManager<T> {

    private cache: Map<string, T>;

    constructor(private maxCacheSize: number) {
        this.cache = new Map<string, T>();
    }

    check(key: string): boolean {
        return this.cache.has(key)
    }

    save(key: string, data: T): void {

        if (this.check(key)) this.remove(key);

        this.cache.set(key, data);

        if (this.cache.size > this.maxCacheSize) {
            this.remove(this.cache.keys().next().value);
        }
    }

    get(key: string): T | undefined {
        const value = this.cache.get(key);
        
        if(value) {
            this.save(key, value); 
        }

        return value;
    }

    remove(key: string): void {
        if(this.check(key)) this.cache.delete(key);
    }

    size(): number {
        return this.cache.size
    }

}
