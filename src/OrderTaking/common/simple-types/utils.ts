export function isNullOrEmpty(str?: string): str is undefined {
    return !str
}
