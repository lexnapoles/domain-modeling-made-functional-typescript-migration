import { OrderAcknowledgmentSent } from '../public-types'

/**
 * Event to send to other bounded contexts
 */
export type OrderAcknowledgmentSentDto = {
    orderId: string
    emailAddress: string
}

/*
 * Convert a OrderAcknowledgmentSent object into the corresponding DTO.
 * Used when exporting from the domain to the outside world.
 */
export function orderAcknowledgmentSentDtoFromDomain({
    orderId,
    emailAddress,
}: OrderAcknowledgmentSent): OrderAcknowledgmentSentDto {
    return {
        orderId,
        emailAddress,
    }
}
