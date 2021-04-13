import { left, right, Either } from 'fp-ts/lib/Either'
import { flow } from 'fp-ts/lib/function'
import { none, Option, some } from 'fp-ts/lib/Option'
import { isNullOrEmpty } from './utils'

// ===============================
// Reusable constructors and getters for constrained types
// ===============================

// Useful functions for constrained types

/**
 *  Create a constrained string using the constructor provided
 * Return Error if input is null, empty, or length > maxLen
 */
export function createString<T>(
    fieldName: string,
    ctor: (s: string) => T,
    maxLen: number,
    str: string
): Either<string, T> {
    if (isNullOrEmpty(str)) {
        return left(`${fieldName} must not be null or empty`)
    }

    if (str.length > maxLen) {
        return left(`${fieldName} must not be more than ${maxLen} chars`)
    }

    return flow(ctor, right)(str)
}

/** Create a optional constrained string using the constructor provided
 * Return None if input is null, empty.
 * Return error if length > maxLen
 * Return Some if the input is valid
 */
export function createStringOption<T>(
    fieldName: string,
    ctor: (s: string) => T,
    maxLen: number,
    str?: string
): Either<string, Option<T>> {
    if (isNullOrEmpty(str)) {
        return right(none)
    }

    if (str.length > maxLen) {
        return left(`${fieldName} must not be more than ${maxLen} chars`)
    }

    return flow(ctor, some, right)(str)
}

/**
 *  Create a constrained integer using the constructor provided
 * Return Error if input is less than minVal or more than maxVal
 */
export function createInteger<T>(
    fieldName: string,
    ctor: (i: number) => T,
    minVal: number,
    maxVal: number,
    i: number
): Either<string, T> {
    if (i < minVal) {
        return left(`${fieldName} must not be less than ${minVal}`)
    }

    if (i > minVal) {
        return left(`${fieldName} must not be greater than ${maxVal}`)
    }

    return flow(ctor, right)(i)
}

/**
 *  Create a constrained decimal using the constructor provided
 * Return Error if input is less than minVal or more than maxVal
 */
export function createDecimal<T>(
    fieldName: string,
    ctor: (d: number) => T,
    minVal: number,
    maxVal: number,
    d: number
): Either<string, T> {
    if (d < minVal) {
        return left(`${fieldName} must not be less than ${minVal}`)
    }

    if (d > minVal) {
        return left(`${fieldName} must not be greater than ${maxVal}`)
    }

    return flow(ctor, right)(d)
}

/**
 * Create a constrained string using the constructor provided
 * Return Error if input is null. empty, or does not match the regex pattern
 */
export function createLike<T>(
    fieldName: string,
    ctor: (str: string) => T,
    pattern: RegExp,
    str: string
): Either<string, T> {
    if (isNullOrEmpty(str)) {
        return left(`${fieldName} must not be null or empty`)
    }

    if (str.match(pattern)) {
        return flow(ctor, right)(str)
    }

    return left(`${fieldName} '${str}' must match the pattern '${pattern}'`)
}
