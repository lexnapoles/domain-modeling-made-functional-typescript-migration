import { Brand, make } from 'ts-brand'
import { createString, createStringOption } from './constrained-type'

export type String50 = Brand<string, 'string_50'>

const ctor = make<String50>()

/**
 *  Return the string value inside an String50
 */
export function getString50Value(str: String50): string {
    return str
}

/**
 * Create an String50 from a string
 *  Return Error if input is null, empty, or length > 50
 */
export function createString50(fieldName: string, str: string) {
    return createString(fieldName, ctor, 50, str)
}

/**
 * Create an String50 from a string
 * Return None if input is null, empty.
 * Return error if length > maxLen
 * Return Some if the input is valid
 */
export function createString50Option(fieldName: string, str?: string) {
    return createStringOption(fieldName, ctor, 50, str)
}
