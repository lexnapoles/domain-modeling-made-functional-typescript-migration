import { Either } from 'fp-ts/lib/Either'
import { Option } from 'fp-ts/lib/Option'
import { TaskEither } from 'fp-ts/lib/TaskEither'
import { EmailAddress } from '../common/simple-types/email-address'
import { OrderId } from '../common/simple-types/order-id'
import { OrderLineId } from '../common/simple-types/order-line-id'
import { OrderQuantity } from '../common/simple-types/order-quantity'
import { Price } from '../common/simple-types/price'
import { ProductCode } from '../common/simple-types/product-code'
import { Address, CustomerInfo } from '../compound-types'
import {
    OrderAcknowledgmentSent,
    PlaceOrderEvent,
    PricedOrder,
    PricingError,
    UnvalidatedAddress,
    UnvalidatedOrder,
    ValidationError,
} from './public-types'

// ---------------------------
// Validation step
// ---------------------------

// Product validation

export type CheckProductCodeExists = (productCode: ProductCode) => boolean

export type InvalidFormat = {
    kind: 'InvalidFormat'
}

export type AddressNotFound = {
    kind: 'AddressNotFound'
}

// Address validation
export type AddressValidationError = InvalidFormat | AddressNotFound

export type CheckedAddress = UnvalidatedAddress

export type CheckAddressExists = (
    unvalidatedAddress: UnvalidatedAddress
) => TaskEither<AddressValidationError, CheckedAddress>

// ---------------------------
// Validated Order
// ---------------------------

export type ValidatedOrderLine = {
    orderLineId: OrderLineId
    productCode: ProductCode
    quantity: OrderQuantity
}

export type ValidatedOrder = {
    orderId: OrderId
    customerInfo: CustomerInfo
    shippingAddress: Address
    billingAddress: Address
    lines: ValidatedOrderLine[]
}

export type ValidateOrder = (
    checkProductCodeExists: CheckProductCodeExists // dependency
) => (
    checkAddressExists: CheckAddressExists // dependency
) => (
    unvalidatedOrder: UnvalidatedOrder // input
) => TaskEither<ValidationError, ValidatedOrder> // output

// ---------------------------
// Pricing step
// ---------------------------

export type GetProductPrice = (productCode: ProductCode) => Price

// priced state is defined Domain.WorkflowTypes

export type PriceOrder = (
    getProductPrice: GetProductPrice // dependency
) => (
    validatedOrder: ValidatedOrder // input
) => Either<PricingError, PricedOrder> // output

// ---------------------------
// Send OrderAcknowledgment
// ---------------------------

export type HtmlString = string

export type OrderAcknowledgment = {
    EmailAddress: EmailAddress
    Letter: HtmlString
}

export type CreateOrderAcknowledgmentLetter = (
    pricedOrder: PricedOrder
) => HtmlString

// Send the order acknowledgement to the customer
// Note that this does NOT generate an Result-export type error (at least not in this workflow)
// because on failure we will continue anyway.
// On success, we will generate a OrderAcknowledgmentSent event,
// but on failure we won't.

export type Sent = {
    kind: 'Sent'
}

export type NotSent = {
    kind: 'NotSent'
}

export type SendResult = Sent | NotSent

export type SendOrderAcknowledgment = (
    orderAcknowledgment: OrderAcknowledgment
) => SendResult

export type AcknowledgeOrder = (
    createOrderAcknowledgmentLetter: CreateOrderAcknowledgmentLetter // dependency
) => (
    sendOrderAcknowledgment: SendOrderAcknowledgment // dependency
) => (
    pricedOrder: PricedOrder // input
) => Option<OrderAcknowledgmentSent> // output

// ---------------------------
// Create events
// ---------------------------

export type CreateEvents = (
    pricedOrder: PricedOrder // input
) => (
    event: Option<OrderAcknowledgmentSent> // input (event from previous step)
) => PlaceOrderEvent[] // output
