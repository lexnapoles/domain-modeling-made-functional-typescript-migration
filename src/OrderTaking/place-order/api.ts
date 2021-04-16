// ======================================================
// This file contains the JSON API interface to the PlaceOrder workflow
//
// 1) The HttpRequest is turned into a DTO, which is then turned into a Domain object
// 2) The main workflow function is called
// 3) The output is turned into a DTO which is turned into a HttpResponse
// ======================================================

import * as T from 'fp-ts/lib/Task'
import * as TE from 'fp-ts/lib/TaskEither'
import * as E from 'fp-ts/lib/Either'
import { createUnsafePrice } from '../common/simple-types/price'

import { ProductCode } from '../common/simple-types/product-code'
import {
    CheckAddressExists,
    CheckProductCodeExists,
    CreateOrderAcknowledgmentLetter,
    GetProductPrice,
    SendOrderAcknowledgment,
} from './internal-types'
import { PlaceOrderError, PlaceOrderEvent } from './public-types'
import { pipe } from 'fp-ts/lib/function'
import { placeOrderEventDtoFromDomain } from './dto/place-order-event-dto'
import { placeOrderErrorDtoFromDomain } from './dto/place-order-error-dto'
import {
    OrderFormDto,
    orderFormDtoToUnvalidatedOrder,
} from './dto/order-form-dto'
import { placeOrder } from './implementation'

export type CheckProductExists = (productCode: ProductCode) => boolean

type JsonString = string

type HttpRequest = {
    action: string
    uri: string
    body: JsonString
}

type HttpResponse = {
    httpStatusCode: number
    body: JsonString
}

// An API takes a HttpRequest as input and returns a async response
export type PlaceOrderApi = (httpRequest: HttpRequest) => T.Task<HttpResponse>

// =============================
// Implementation
// =============================

// setup dummy dependencies

const checkProductExists: CheckProductCodeExists = (_productCode) => true // dummy implementation

const checkAddressExists: CheckAddressExists = (unvalidatedAddress) => {
    return TE.of(unvalidatedAddress)
}

const getProductPrice: GetProductPrice = (_productCode) => createUnsafePrice(1)

const createOrderAcknowledgmentLetter: CreateOrderAcknowledgmentLetter = (
    _pricedOrder
) => 'some text'

const sendOrderAcknowledgment: SendOrderAcknowledgment = (
    _orderAcknowledgement
) => ({
    kind: 'Sent',
})

// -------------------------------
// workflow
// -------------------------------

/// This function converts the workflow output into a HttpResponse
function workflowResultToHttpResponse(
    result: E.Either<PlaceOrderError, PlaceOrderEvent[]>
): HttpResponse {
    return pipe(
        result,
        E.map((events) => {
            const dtos = events.map(placeOrderEventDtoFromDomain)
            const json = JSON.stringify(dtos)

            return {
                httpStatusCode: 200,
                body: json,
            }
        }),
        E.getOrElse((error) => {
            const dto = placeOrderErrorDtoFromDomain(error)
            const json = JSON.stringify(dto)
            return {
                httpStatusCode: 401,
                body: json,
            }
        })
    )
}

export const placeOrderApi: PlaceOrderApi = (request) => {
    const { body: orderFormJson } = request

    const orderForm = JSON.parse(orderFormJson) as OrderFormDto

    const unvalidatedOrder = orderFormDtoToUnvalidatedOrder(orderForm)

    const workflow = placeOrder(checkProductExists)(checkAddressExists)(
        getProductPrice
    )(createOrderAcknowledgmentLetter)(sendOrderAcknowledgment)

    return pipe(unvalidatedOrder, workflow, T.map(workflowResultToHttpResponse))
}
