import { sequenceS } from 'fp-ts/lib/Apply'
import { Either, either } from 'fp-ts/lib/Either'
import { getOrElseW } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/pipeable'

import {
    createString50,
    createString50Option,
} from '../../common/simple-types/string-50'
import { createZipCode } from '../../common/simple-types/zip-code'
import { Address } from '../../compound-types'
import { UnvalidatedAddress } from '../public-types'

export type AddressDto = {
    addressLine1: string
    addressLine2?: string
    addressLine3?: string
    addressLine4?: string
    city: string
    zipCode: string
}

/**
 * Convert the DTO into a UnvalidatedAddress object.
 * This always succeeds because there is no validation.
 * Used when importing an OrderForm from the outside world into the domain.
 */
export function toUnvalidatedAddress({
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
    city,
    zipCode,
}: AddressDto): UnvalidatedAddress {
    return {
        addressLine1,
        addressLine2,
        addressLine3,
        addressLine4,
        city,
        zipCode,
    }
}

/**
 * Convert the DTO into a CustomerInfo object
 * Used when importing from the outside world into the domain, eg loading from a database
 */
export function addressDtoToAddress({
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
    city,
    zipCode,
}: AddressDto): Either<string, Address> {
    return sequenceS(either)({
        addressLine1: createString50('addressLine1', addressLine1),
        addressLine2: createString50Option('addressLine2', addressLine2),
        addressLine3: createString50Option('addressLine3', addressLine3),
        addressLine4: createString50Option('addressLine4', addressLine4),
        city: createString50('city', city),
        zipCode: createZipCode('zipCode', zipCode),
    })
}

export function addressDtofromAddress({
    addressLine1,
    addressLine2,
    addressLine3,
    addressLine4,
    city,
    zipCode,
}: Address): AddressDto {
    const getAddressOrDefault = getOrElseW(() => undefined)

    return {
        addressLine1,
        addressLine2: pipe(addressLine2, getAddressOrDefault),
        addressLine3: pipe(addressLine3, getAddressOrDefault),
        addressLine4: pipe(addressLine4, getAddressOrDefault),
        city,
        zipCode,
    }
}
