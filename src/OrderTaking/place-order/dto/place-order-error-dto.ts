import { PlaceOrderError } from '../public-types'

export type PlaceOrderErrorDto = {
    code: string
    message: string
}

export function placeOrderErrorDtoFromDomain(
    domainObj: PlaceOrderError
): PlaceOrderErrorDto {
    switch (domainObj.kind) {
        case 'ValidationError': {
            return {
                code: 'ValidationError',
                message: domainObj.error,
            }
        }
        case 'PricingError':
            return {
                code: 'PricingError',
                message: domainObj.error,
            }
        case 'RemoteServiceError':
            return {
                code: 'RemoteServiceError',
                message: `${domainObj.service.name}: ${domainObj.exception.message}`,
            }
    }
}
