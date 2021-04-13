import { UnvalidatedOrderLine } from '../public-types'

/**
 * From the order form used as input
 */
export type OrderFormLineDto = {
    orderLineId: string
    productCode: string
    quantity: number
}

export function orderFormLineDtoToUnvalidatedOrderLine({
    orderLineId,
    productCode,
    quantity,
}: OrderFormLineDto): UnvalidatedOrderLine {
    return {
        orderLineId,
        productCode,
        quantity,
    }
}
