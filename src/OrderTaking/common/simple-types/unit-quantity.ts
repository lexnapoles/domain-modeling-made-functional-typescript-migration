import { createInteger } from './constrained-type'

export type UnitQuantity = {
    kind: 'Unit Quantity'
    unit: number
}

export function getUnitQuantityValue({ unit }: UnitQuantity) {
    return unit
}

export function ctor(unit: number): UnitQuantity {
    return {
        kind: 'Unit Quantity',
        unit,
    }
}

export function createUnitQuantity(fieldName: string, v: number) {
    return createInteger(fieldName, ctor, 1, 1000, v)
}
