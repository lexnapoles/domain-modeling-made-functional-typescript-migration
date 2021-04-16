import { Either, left } from 'fp-ts/lib/Either'
import { GizmoCode, getGizmoCodeValue, createGizmoCode } from './gizmo-code'
import { WidgetCode, getWidgetCode, createWidgetCode } from './widget-code'
import { isNullOrEmpty } from './utils'
import { assertNever } from '../../../assert-never'

export type ProductCode = GizmoCode | WidgetCode

/**
 *  Return the string value inside an GizmoCode
 */
export function getProductCodeValue(productCode: ProductCode): string {
    switch (productCode.kind) {
        case 'GizmoCode':
            return getGizmoCodeValue(productCode)
        case 'WidgetCode':
            return getWidgetCode(productCode)
        default:
            assertNever(productCode)
    }
}

/**
 * Create an ProductCode from a string
 * Return Error if input is null, empty, or not matching pattern
 */
export function createProductCode(
    fieldName: string,
    code: string
): Either<string, ProductCode> {
    if (isNullOrEmpty(code)) {
        return left(`${fieldName} must not be null or empty`)
    }

    if (code.startsWith('W')) {
        return createGizmoCode(fieldName, code)
    }

    if (code.startsWith('G')) {
        return createWidgetCode(fieldName, code)
    }

    return left(`${fieldName}: Format not recognized '${code}'`)
}
