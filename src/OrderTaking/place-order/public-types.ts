// ==================================
// This file contains the definitions of PUBLIC export types (exposed at the boundary of the bounded context)
// related to the PlaceOrder workflow
// ==================================

import { TaskEither } from 'fp-ts/lib/TaskEither'
import { BillingAmount } from '../common/simple-types/billing-amount'
import { EmailAddress } from '../common/simple-types/email-address'
import { OrderId } from '../common/simple-types/order-id'
import { OrderLineId } from '../common/simple-types/order-line-id'
import { OrderQuantity } from '../common/simple-types/order-quantity'
import { Price } from '../common/simple-types/price'
import { ProductCode } from '../common/simple-types/product-code'
import { Address, CustomerInfo } from '../compound-types'

// ------------------------------------
// inputs to the workflow

export type UnvalidatedCustomerInfo = {
    firstName: string
    lastName: string
    emailAddress: string
}

export type UnvalidatedAddress = {
    addressLine1: string
    addressLine2?: string
    addressLine3?: string
    addressLine4?: string
    city: string
    zipCode: string
}

export type UnvalidatedOrderLine = {
    orderLineId: string
    productCode: string
    quantity: number
}

export type UnvalidatedOrder = {
    orderId: string
    customerInfo: UnvalidatedCustomerInfo
    shippingAddress: UnvalidatedAddress
    billingAddress: UnvalidatedAddress
    lines: UnvalidatedOrderLine[]
}

// ------------------------------------
// outputs from the workflow (success case)

/**
 * Event will be created if the Acknowledgment was successfully posted
 */
export type OrderAcknowledgmentSent = {
    kind: 'OrderAcknowledgmentSent'
    orderId: OrderId
    emailAddress: EmailAddress
}

export function toOrderAcknowledgmentSent(
    orderId: OrderId,
    emailAddress: EmailAddress
): OrderAcknowledgmentSent {
    return {
        kind: 'OrderAcknowledgmentSent',
        orderId,
        emailAddress,
    }
}

/**
 * Priced state
 */
export type PricedOrderLine = {
    orderLineId: OrderLineId
    productCode: ProductCode
    quantity: OrderQuantity
    linePrice: Price
}

export type PricedOrder = {
    orderId: OrderId
    customerInfo: CustomerInfo
    shippingAddress: Address
    billingAddress: Address
    amountToBill: BillingAmount
    lines: PricedOrderLine[]
}

/**
 * Event to send to shipping context
 */
export interface OrderPlaced extends PricedOrder {
    kind: 'OrderPlaced'
}

/**
 * Event to send to billing context
 * Will only be created if the AmountToBill is not zero
 */
export type BillableOrderPlaced = {
    kind: 'BillableOrderPlaced'
    orderId: OrderId
    billingAddress: Address
    amountToBill: BillingAmount
}

/**
 * The possible events resulting from the PlaceOrder workflow
 * Not all events will occur, depending on the logic of the workflow
 */
export type PlaceOrderEvent =
    | OrderPlaced
    | BillableOrderPlaced
    | OrderAcknowledgmentSent

// ------------------------------------
// error outputs

// All the things that can go wrong in this workflow
export type ValidationError = {
    kind: 'ValidationError'
    error: string
}

export function toValidationError(error: string): ValidationError {
    return {
        kind: 'ValidationError',
        error,
    }
}

export type PricingError = {
    kind: 'PricingError'
    error: string
}

export function toPricingError(error: string): PricingError {
    return {
        kind: 'PricingError',
        error,
    }
}

export type ServiceInfo = {
    name: string
    endpoint: string
}

export type RemoteServiceError = {
    kind: 'RemoteServiceError'
    service: ServiceInfo
    exception: Error
}

export type PlaceOrderError =
    | ValidationError
    | PricingError
    | RemoteServiceError

// ------------------------------------
// the workflow itself

export type PlaceOrder = (
    unvalidatedOrder: UnvalidatedOrder
) => TaskEither<UnvalidatedOrder, PlaceOrderEvent[]>
