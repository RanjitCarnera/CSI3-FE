export function last<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined
    }
    return [...array].reverse().find(() => true)
}

export function head<T>(array: T[]): T | undefined {
    return array.find(() => true)
}
