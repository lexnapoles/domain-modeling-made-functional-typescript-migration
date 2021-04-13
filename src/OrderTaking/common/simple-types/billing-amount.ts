import { Brand, make } from 'ts-brand'
import { createDecimal } from './constrained-type'
import { Price } from './price'

export type BillingAmount = Brand<number, 'billing_amount'>

export function getBillingAmountValue(v: BillingAmount): number {
    return v
}

export function createBillingAmount(v: number) {
    return createDecimal('BillingAmount', make<BillingAmount>(), 0, 10000, v)
}

export function sumPrices(prices: Price[]) {
    const total = prices.reduce((totalPrice: number, price: Price) => {
        return totalPrice + price
    }, 0)

    return createBillingAmount(total)
}
