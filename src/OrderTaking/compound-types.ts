import { Option } from 'fp-ts/lib/Option'
import { EmailAddress } from './common/simple-types/email-address'
import { String50 } from './common/simple-types/string-50'
import { ZipCode } from './common/simple-types/zip-code'

// ==================================
// Common compound types used throughout the OrderTaking domain
//
// Includes: customers, addresses, etc.
// Plus common errors.
//
// ==================================

// ==================================
// Customer-related types
// ==================================

export type PersonalName = {
    firstName: String50
    lastName: String50
}

export type CustomerInfo = {
    name: PersonalName
    emailAddress: EmailAddress
}

// ==================================
// Address-related
// ==================================

export type Address = {
    addressLine1: String50
    addressLine2: Option<String50>
    addressLine3: Option<String50>
    addressLine4: Option<String50>
    city: String50
    zipCode: ZipCode
}
