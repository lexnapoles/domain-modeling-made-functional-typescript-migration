import { pipe } from 'fp-ts/lib/pipeable'
import { getOrderQuantityValue } from '../../common/simple-types/order-quantity'
import { getProductCodeValue } from '../../common/simple-types/product-code'
import { PricedOrderLine } from '../public-types'

/// Used in the output of the workflow
export type PricedOrderLineDto = {
    orderLineId: string
    productCode: string
    quantity: number
    linePrice: number
}

/**
 *  Convert a PricedOrderLine object into the corresponding DTO.
 * Used when exporting from the domain to the outside world.
 */
export function pricedOrderLineDtoFromDomain({
    orderLineId,
    productCode,
    quantity,
    linePrice,
}: PricedOrderLine): PricedOrderLineDto {
    return {
        orderLineId,
        productCode: pipe(productCode, getProductCodeValue),
        quantity: pipe(quantity, getOrderQuantityValue),
        linePrice,
    }
}
