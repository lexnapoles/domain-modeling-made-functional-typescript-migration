import { createDecimal } from './constrained-type'

export type KilogramQuantity = {
    kind: 'Kilogram Quantity'
    kilogram: number
}

function ctor(v: number): KilogramQuantity {
    return {
        kind: 'Kilogram Quantity',
        kilogram: v,
    }
}

export function getKilogramQuantityValue({ kilogram }: KilogramQuantity) {
    return kilogram
}

export function createKilogramQuantity(fieldName: string, v: number) {
    return createDecimal(fieldName, ctor, 0.5, 100, v)
}
