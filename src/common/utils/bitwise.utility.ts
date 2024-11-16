import { EnumValue } from "@/common/types/collection.type";

export class BitwiseOperator<T extends Record<string | number | symbol, unknown>> {

    private readonly base: number = 2.0

    constructor(private readonly enumeratedObject: T) { }

    private getOrdinalValue(enumValue: EnumValue<T>): number {
        const values = Object.values(this.enumeratedObject);
        return values.indexOf(enumValue);
    }

    private getEnumIntValue(value: EnumValue<T>): number {
        return Math.pow(this.base, this.getOrdinalValue(value))
    }

    public setValue(src: number, value: EnumValue<T>): number {
        return src | this.getEnumIntValue(value)
    }

    public hasValue(src: number, value: EnumValue<T>): boolean {
        if (src == 0) return false
        const min = Math.min(src, this.getEnumIntValue(value))
        return (src & this.getEnumIntValue(value)) == min
    }

    public removeValue(src: number, value: EnumValue<T>): number {
        return src & ~this.getEnumIntValue(value)
    }
}