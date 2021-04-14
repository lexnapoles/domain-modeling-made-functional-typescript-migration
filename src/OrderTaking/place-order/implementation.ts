// ---------------------------
// ValidateOrder step
// ---------------------------

import { sequenceS } from 'fp-ts/lib/Apply'
import * as A from 'fp-ts/lib/Array'
import * as E from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { none, some } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'
import * as TE from 'fp-ts/lib/TaskEither'
import { sumPrices } from '../common/simple-types/billing-amount'
import { createEmailAddress } from '../common/simple-types/email-address'
import { createOrderId } from '../common/simple-types/order-id'
import { createOrderLineId } from '../common/simple-types/order-line-id'
import {
    createOrderQuantity,
    getOrderQuantityValue,
} from '../common/simple-types/order-quantity'
import { multiply, Price } from '../common/simple-types/price'
import {
    createProductCode,
    ProductCode,
} from '../common/simple-types/product-code'
import {
    createString50,
    createString50Option,
} from '../common/simple-types/string-50'
import { createZipCode } from '../common/simple-types/zip-code'
import { Address, CustomerInfo } from '../compound-types'
import { CheckProductExists } from './api'
import {
    AcknowledgeOrder,
    CheckAddressExists,
    CheckedAddress,
    CheckProductCodeExists,
    GetProductPrice,
    PriceOrder,
    ValidatedOrderLine,
    ValidateOrder,
} from './internal-types'
import {
    PricedOrderLine,
    PricingError,
    toOrderAcknowledgmentSent,
    toPricingError,
    toValidationError,
    UnvalidatedAddress,
    UnvalidatedCustomerInfo,
    UnvalidatedOrderLine,
    ValidationError,
} from './public-types'

function toCustomerInfo({
    firstName,
    lastName,
    emailAddress,
}: UnvalidatedCustomerInfo): E.Either<ValidationError, CustomerInfo> {
    return pipe(
        sequenceS(E.either)({
            firstName: createString50('firstName', firstName),
            lastName: createString50('lastName', lastName),
            emailAddress: createEmailAddress('emailAddress', emailAddress),
        }),
        E.bimap(toValidationError, ({ firstName, lastName, emailAddress }) => ({
            name: { firstName, lastName },
            emailAddress,
        }))
    )
}

function toAddress({
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
    city,
    zipCode,
}: CheckedAddress): E.Either<ValidationError, Address> {
    return pipe(
        sequenceS(E.either)({
            addressLine1: createString50('addressLine1', addressLine1),
            addressLine2: createString50Option('addressLine2', addressLine2),
            addressLine3: createString50Option('addressLine3', addressLine3),
            addressLine4: createString50Option('addressLine4', addressLine4),
            city: createString50('city', city),
            zipCode: createZipCode('zipCode', zipCode),
        }),
        E.mapLeft(toValidationError)
    )
}

const toCheckedAddress = (checkAddress: CheckAddressExists) => (
    address: UnvalidatedAddress
): TE.TaskEither<ValidationError, CheckedAddress> => {
    return pipe(
        address,
        checkAddress,
        TE.mapLeft((error) => {
            switch (error.kind) {
                case 'AddressNotFound':
                    return toValidationError('Address not found')
                case 'InvalidFormat':
                    return toValidationError('Address has bad format')
            }
        })
    )
}

function toOrderId(orderId: string) {
    return pipe(createOrderId('orderId', orderId), E.mapLeft(toValidationError))
}

function toOrderLineId(orderLineId: string) {
    return pipe(
        createOrderLineId('orderLineId', orderLineId),
        E.mapLeft(toValidationError)
    )
}

const toProductCode = (checkProductCodeExists: CheckProductCodeExists) => (
    productCode: string
) => {
    const checkProduct = (productCode: ProductCode) =>
        pipe(
            productCode,
            E.fromPredicate(checkProductCodeExists, () =>
                toValidationError(`Invalid: ${productCode}`)
            )
        )

    return pipe(
        createProductCode('productCode', productCode),
        E.mapLeft(toValidationError),
        E.chain(checkProduct)
    )
}

const toOrderQuantity = (productCode: ProductCode) => (quantity: number) => {
    return pipe(
        createOrderQuantity('orderQuantity', productCode, quantity),
        E.mapLeft(toValidationError)
    )
}

const toValidatedOrderLine = (checkProductExists: CheckProductExists) => (
    unvalidatedOrderLine: UnvalidatedOrderLine
): E.Either<ValidationError, ValidatedOrderLine> => {
    return pipe(
        unvalidatedOrderLine.productCode,
        toProductCode(checkProductExists),
        (productCode) =>
            sequenceS(E.either)({
                productCode,
                orderLineId: toOrderLineId(unvalidatedOrderLine.orderLineId),
                quantity: pipe(
                    E.right(toOrderQuantity),
                    E.ap(productCode),
                    E.chain((f) => f(unvalidatedOrderLine.quantity))
                ),
            })
    )
}

const validateOrder: ValidateOrder = (checkProductCodeExists) => (
    checkAddressExists
) => (unvalidatedOrder) => {
    const toValidatedAddress = flow(
        toCheckedAddress(checkAddressExists),
        TE.chain(flow(toAddress, TE.fromEither))
    )

    return sequenceS(TE.taskEither)({
        orderId: pipe(unvalidatedOrder.orderId, toOrderId, TE.fromEither),
        customerInfo: pipe(
            unvalidatedOrder.customerInfo,
            toCustomerInfo,
            TE.fromEither
        ),
        shippingAddress: toValidatedAddress(unvalidatedOrder.shippingAddress),
        billingAddress: toValidatedAddress(unvalidatedOrder.billingAddress),
        lines: pipe(
            unvalidatedOrder.lines,
            A.map(toValidatedOrderLine(checkProductCodeExists)),
            A.sequence(E.either),
            TE.fromEither
        ),
    })
}

// ---------------------------
// PriceOrder step
// ---------------------------

const toPricedOrderLine = (getProductPrice: GetProductPrice) => ({
    quantity,
    productCode,
    orderLineId,
}: ValidatedOrderLine): E.Either<PricingError, PricedOrderLine> => {
    const qty = getOrderQuantityValue(quantity)
    const price = getProductPrice(productCode)

    return pipe(
        multiply(qty, price),
        E.map((linePrice) => ({
            quantity,
            orderLineId,
            productCode,
            linePrice,
        })),
        E.mapLeft(toPricingError)
    )
}

const priceOrder: PriceOrder = (getProductPrice) => (validatedOrder) => {
    const lines = pipe(
        validatedOrder.lines,
        A.map(toPricedOrderLine(getProductPrice)),
        A.sequence(E.either)
    )

    const amountToBill = pipe(
        lines,
        E.chain(
            flow(
                A.map(({ linePrice }) => linePrice),
                sumPrices,
                E.mapLeft(toPricingError)
            )
        )
    )

    return pipe(
        { lines, amountToBill },
        sequenceS(E.either),
        E.map(
            merge({
                orderId: validatedOrder.orderId,
                customerInfo: validatedOrder.customerInfo,
                shippingAddress: validatedOrder.shippingAddress,
                billingAddress: validatedOrder.billingAddress,
            })
        )
    )
}

// naive merge
function merge<T = object, V = object>(t: T) {
    return function mergeVAndT(v: V) {
        return {
            ...t,
            ...v,
        }
    }
}

// ---------------------------
// AcknowledgeOrder step
// ---------------------------

const acknowledgeOrder: AcknowledgeOrder = (createAcknowledgmentLetter) => (
    sendAcknowledgment
) => (pricedOrder) => {
    const acknowledgement = {
        emailAddress: pricedOrder.customerInfo.emailAddress,
        letter: createAcknowledgmentLetter(pricedOrder),
    }

    // if the acknowledgement was successfully sent,
    // return the corresponding event, else return None

    switch (sendAcknowledgment(acknowledgement).kind) {
        case 'Sent': {
            const event = toOrderAcknowledgmentSent(
                pricedOrder.orderId,
                pricedOrder.customerInfo.emailAddress
            )

            return some(event)
        }

        case 'NotSent':
            return none
    }
}
