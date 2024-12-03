export interface ICacheManager<T> {
    check(key: string): boolean
    save(key: string, data: T): void
    get(key: string): T | undefined
    remove(key: string): void
    size(): number
}