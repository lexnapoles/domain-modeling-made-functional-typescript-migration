import { Brand, make } from 'ts-brand'
import { createString } from './constrained-type'

export type OrderLineId = Brand<string, 'order_line_id'>

/**
 *  Return the string value inside an OrderLineId
 */
export function getOrderLineIdvalue(str: OrderLineId): string {
    return str
}

/**
 * Create an OrderLineId from a string
 *  Return Error if input is null, empty, or length > 50
 */
export function createOrderLineId(fieldName: string, str: string) {
    return createString(fieldName, make<OrderLineId>(), 50, str)
}
