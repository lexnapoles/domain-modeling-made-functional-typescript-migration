import { pipe } from 'fp-ts/lib/function'
import { Brand, make } from 'ts-brand'
import { createDecimal } from './constrained-type'
import { getOrElseW } from 'fp-ts/lib/Either'

export type Price = Brand<number, 'price'>

export function getPriceValue(price: Price): number {
    return price
}

export function createPrice(v: number) {
    return createDecimal('Price', make<Price>(), 0, 1000, v)
}

export function createUnsafePrice(v: number) {
    return pipe(
        v,
        createPrice,
        getOrElseW((err) => {
            throw new Error(`Not expecting Price to be out of bounds ${err}`)
        })
    )
}

export function multiply(qty: number, p: Price) {
    return createPrice(qty * p)
}
