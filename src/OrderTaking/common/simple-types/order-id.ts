import { Brand, make } from 'ts-brand'
import { createString } from './constrained-type'

export type OrderId = Brand<string, 'order_id'>

/**
 *  Return the string value inside an OrderId
 */
export function getOrderIdValue(str: OrderId): string {
    return str
}

/**
 * Create an OrderId from a string
 *  Return Error if input is null, empty, or length > 50
 */
export function createOrderId(fieldName: string, str: string) {
    return createString(fieldName, make<OrderId>(), 50, str)
}
