import { Either } from 'fp-ts/lib/Either'
import {
    createKilogramQuantity,
    getKilogramQuantityValue,
    KilogramQuantity,
} from './kilogram-quantity'
import { ProductCode } from './product-code'
import {
    createUnitQuantity,
    getUnitQuantityValue,
    UnitQuantity,
} from './unit-quantity'

export type OrderQuantity = UnitQuantity | KilogramQuantity

export function getOrderQuantityValue(qty: OrderQuantity) {
    switch (qty.kind) {
        case 'Unit Quantity':
            return getUnitQuantityValue(qty)
        case 'Kilogram Quantity':
            return getKilogramQuantityValue(qty)
    }
}

export function createOrderQuantity(
    fieldName: string,
    productCode: ProductCode,
    quantity: number
): Either<string, OrderQuantity> {
    switch (productCode.kind) {
        case 'WidgetCode':
            return createUnitQuantity(fieldName, quantity)
        case 'GizmoCode':
            return createKilogramQuantity(fieldName, quantity)
    }
}
