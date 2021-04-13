import { createLike } from './constrained-type'

export type WidgetCode = {
    kind: 'WidgetCode'
    code: string
}

function ctor(code: string): WidgetCode {
    return {
        kind: 'WidgetCode',
        code,
    }
}

/**
 *  Return the string value inside an WidgetCode
 */
export function getWidgetCode({ code }: WidgetCode) {
    return code as string
}

/**
 * Create an WidgetCode from a string
 *  Return Error if input is null, empty, or doesn't have an "@" in it
 */
export function createWidgetCode(fieldName: string, code: string) {
    const pattern = /W\d{4}/

    return createLike(fieldName, ctor, pattern, code)
}
