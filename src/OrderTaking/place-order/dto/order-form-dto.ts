import { pipe } from 'fp-ts/lib/pipeable'
import { UnvalidatedOrder } from '../public-types'
import { AddressDto, toUnvalidatedAddress } from './address-dto'
import {
    CustomerInfoDto,
    customerInfoDtoToUnvalidatedCustomerInfo,
} from './customer-info-dto'
import {
    OrderFormLineDto,
    orderFormLineDtoToUnvalidatedOrderLine,
} from './order-form-line-dto'

export type OrderFormDto = {
    orderId: string
    customerInfo: CustomerInfoDto
    shippingAddress: AddressDto
    billingAddress: AddressDto
    lines: OrderFormLineDto[]
}
/**
 * Convert the OrderForm into a UnvalidatedOrder
 * This always succeeds because there is no validation.
 */
export function orderFormDtoToUnvalidatedOrder({
    orderId,
    customerInfo,
    shippingAddress,
    billingAddress,
    lines,
}: OrderFormDto): UnvalidatedOrder {
    return {
        orderId,
        customerInfo: pipe(
            customerInfo,
            customerInfoDtoToUnvalidatedCustomerInfo
        ),
        shippingAddress: pipe(shippingAddress, toUnvalidatedAddress),
        billingAddress: pipe(billingAddress, toUnvalidatedAddress),
        lines: lines.map(orderFormLineDtoToUnvalidatedOrderLine),
    }
}
