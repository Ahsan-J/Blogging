export interface DataSeeder<T = unknown> {
    seed(data: Array<Partial<T>>): void;
}