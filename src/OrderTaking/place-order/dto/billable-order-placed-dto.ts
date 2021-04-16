import { pipe } from 'fp-ts/lib/pipeable'
import { BillableOrderPlaced } from '../public-types'
import { AddressDto, addressDtofromAddress } from './address-dto'

/**
 *  Event to send to billing context
 */
export type BillableOrderPlacedDto = {
    orderId: string
    billingAddress: AddressDto
    amountToBill: number
}

/**
 * Convert a BillableOrderPlaced object into the corresponding DTO.
 * Used when exporting from the domain to the outside world.
 */
export function billableOrderPlacedDtoFromDomain({
    orderId,
    billingAddress,
    amountToBill,
}: BillableOrderPlaced): BillableOrderPlacedDto {
    return {
        orderId,
        billingAddress: pipe(billingAddress, addressDtofromAddress),
        amountToBill,
    }
}
