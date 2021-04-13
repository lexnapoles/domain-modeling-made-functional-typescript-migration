import { sequenceS } from 'fp-ts/lib/Apply'
import { Either, either, map } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/pipeable'
import { createEmailAddress } from '../../common/simple-types/email-address'
import { createString50 } from '../../common/simple-types/string-50'
import { CustomerInfo } from '../../compound-types'
import { UnvalidatedCustomerInfo } from '../public-types'

export type CustomerInfoDto = {
    firstName: string
    lastName: string
    emailAddress: string
}

/**
 * Convert the DTO into a UnvalidatedCustomerInfo object.
 * This always succeeds because there is no validation.
 * Used when importing an OrderForm from the outside world into the domain.
 */
export function customerInfoDtoToUnvalidatedCustomerInfo(
    dto: CustomerInfoDto
): UnvalidatedCustomerInfo {
    return {
        firstName: dto.firstName,
        lastName: dto.lastName,
        emailAddress: dto.emailAddress,
    }
}

/**
 * Convert the DTO into a CustomerInfo object
 * Used when importing from the outside world into the domain, eg loading from a database
 */
export function customerInfoDtoToCustomerInfo(
    dto: CustomerInfoDto
): Either<string, CustomerInfo> {
    return pipe(
        sequenceS(either)({
            firstName: createString50('firstName', dto.firstName),
            lastName: createString50('lastName', dto.lastName),
            emailAddress: createEmailAddress('emailAddress', dto.emailAddress),
        }),
        map(({ firstName, lastName, emailAddress }) => ({
            name: {
                firstName,
                lastName,
            },
            emailAddress,
        }))
    )
}

export function customerInfoDtoFromCustomerInfo({
    name: { firstName, lastName },
    emailAddress,
}: CustomerInfo): CustomerInfoDto {
    return {
        firstName,
        lastName,
        emailAddress,
    }
}
