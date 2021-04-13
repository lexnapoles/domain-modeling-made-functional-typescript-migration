import { ProductCode } from '../common/simple-types/product-code'

export type CheckProductExists = (productCode: ProductCode) => boolean
export const checkProductExists: CheckProductExists = (productCode) => true
