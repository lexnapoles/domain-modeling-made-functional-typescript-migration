import { pipe } from 'fp-ts/lib/pipeable'
import { PlaceOrderEvent } from '../public-types'
import { billableOrderPlacedDtoFromDomain } from './billable-order-placed-dto'
import { orderAcknowledgmentSentDtoFromDomain } from './order-acknowledgment-sent-dto'
import { orderPlacedDtoFromDomain } from './order-placed-dto'

export type PlaceOrderEventDto = Map<string, object>

export function placeOrderEventDtoFromDomain(
    domainObj: PlaceOrderEvent
): PlaceOrderEventDto {
    switch (domainObj.kind) {
        case 'OrderPlaced': {
            const obj = pipe(domainObj, orderPlacedDtoFromDomain)
            const key = 'OrderPlaced'

            return new Map([[key, obj]])
        }
        case 'BillableOrderPlaced': {
            const obj = pipe(domainObj, billableOrderPlacedDtoFromDomain)
            const key = 'BillableOrderPlaced'

            return new Map([[key, obj]])
        }
        case 'OrderAcknowledgmentSent': {
            const obj = pipe(domainObj, orderAcknowledgmentSentDtoFromDomain)
            const key = 'OrderAcknowledgmentSent'

            return new Map([[key, obj]])
        }
    }
}
