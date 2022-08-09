import { CACHE_MANAGER, Inject, Injectable } from "@nestjs/common";
import { Cache, CachingConfig } from "cache-manager";

@Injectable()
export class CacheService {
    constructor(
        @Inject(CACHE_MANAGER)
        private cacheManager: Cache
    ) {}

    get(key: string) {
        return this.cacheManager.get(key)
    }

    set(key:string, value: string, option? : CachingConfig) {
        return this.cacheManager.set(key, value, Object.assign({ttl: 86400}, option))
    }

    del(key: string) {
        return this.cacheManager.del(key)
    }

    reset() {
        return this.cacheManager.reset();
    }
}