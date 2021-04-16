export function assertNever(_x: never): never {
    throw new Error('Unhandled case on discriminated union')
}
