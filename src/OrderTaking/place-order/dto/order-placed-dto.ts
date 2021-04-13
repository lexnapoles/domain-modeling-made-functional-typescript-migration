import { pipe } from 'fp-ts/lib/pipeable'
import { OrderPlaced } from '../public-types'
import { AddressDto, addressDtofromAddress } from './address-dto'
import {
    CustomerInfoDto,
    customerInfoDtoFromCustomerInfo,
} from './customer-info-dto'
import * as PricedOrderLineDto from './priced-order-line-dto'

/*
 * Event to send to shipping context
 */
export type OrderPlacedDto = {
    orderId: string
    customerInfo: CustomerInfoDto
    shippingAddress: AddressDto
    billingAddress: AddressDto
    amountToBill: number
    lines: PricedOrderLineDto.PricedOrderLineDto[]
}

export function orderPlacedDtoFromDomain({
    orderId,
    customerInfo,
    shippingAddress,
    billingAddress,
    amountToBill,
    lines,
}: OrderPlaced): OrderPlacedDto {
    return {
        orderId,
        customerInfo: pipe(customerInfo, customerInfoDtoFromCustomerInfo),
        shippingAddress: pipe(shippingAddress, addressDtofromAddress),
        billingAddress: pipe(billingAddress, addressDtofromAddress),
        amountToBill,
        lines: lines.map(PricedOrderLineDto.pricedOrderLineDtoFromDomain),
    }
}
