interface VaporStoreOptions {
    bucket?: string
    contentType?: string
    expires?: string
    visibility?: string
    baseURL?: string
    headers?: Record<string, unknown>
    options?: any
}

declare class Vapor {
    store(file: File, options?: VaporStoreOptions): Promise<any>
}

declare const VaporInstance: Vapor
export default VaporInstance
