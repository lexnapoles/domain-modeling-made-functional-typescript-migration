import { Brand, make } from 'ts-brand'
import { createLike } from './constrained-type'

export type EmailAddress = Brand<string, 'email_address'>

/**
 *  Return the string value inside an EmailAddress
 */
export function getEmailAddressValue(str: EmailAddress): string {
    return str
}

/**
 * Create an EmailAddress from a string
 *  Return Error if input is null, empty, or doesn't have an "@" in it
 */
export function createEmailAddress(fieldName: string, str: string) {
    const pattern = /.+@.+/

    return createLike(fieldName, make<EmailAddress>(), pattern, str)
}
