import { Brand, make } from 'ts-brand'
import { createLike } from './constrained-type'

export type ZipCode = Brand<string, 'zip_code'>

/**
 *  Return the string value inside an ZipCode
 */
export function getZipCodeValue(str: ZipCode) {
    return str as string
}

/**
 * Create an ZipCode from a string
 *  Return Error if input is null, empty, or doesn't have an "@" in it
 */
export function createZipCode(fieldName: string, str: string) {
    const pattern = /\d{5}/

    return createLike(fieldName, make<ZipCode>(), pattern, str)
}
