
export class BitwiseOperator<T extends number>{

    private readonly base: number = 2.0

    constructor() { }

    private getEnumIntValue(value: T): number {
        return Math.pow(this.base, value)
    }

    public setValue(src: number, value: T): number {
        return src | this.getEnumIntValue(value)
    }

    public hasValue(src: number, value: T): boolean {
        if (src == 0) return false
        const min = Math.min(src, this.getEnumIntValue(value))
        return (src & this.getEnumIntValue(value)) == min
    }

    public removeValue(src: number, value: T): number {
        return src & ~this.getEnumIntValue(value)
    }
}