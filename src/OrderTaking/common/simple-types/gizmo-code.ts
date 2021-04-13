import { createLike } from './constrained-type'

export type GizmoCode = {
    kind: 'GizmoCode'
    code: string
}

function ctor(code: string): GizmoCode {
    return {
        kind: 'GizmoCode',
        code,
    }
}

/**
 *  Return the string value inside an GizmoCode
 */
export function getGizmoCodeValue({ code }: GizmoCode) {
    return code as string
}

/**
 * Create an GizmoCode from a string
 *  Return Error if input is null, empty, or doesn't have an "@" in it
 */
export function createGizmoCode(fieldName: string, code: string) {
    const pattern = /G\d{3}/

    return createLike(fieldName, ctor, pattern, code)
}
