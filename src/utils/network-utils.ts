import axios, { AxiosRequestConfig } from 'axios'

export interface NetworkRequest {
    executed?: boolean
    requestConfig: AxiosRequestConfig
    onSuccess?: (data: any) => void
    onError?: (error: unknown) => void
}

export async function attemptToExecuteRequests(...requests: NetworkRequest[]): Promise<NetworkRequest[]> {
    const erroredRequests: NetworkRequest[] = []

    for (const request of requests) {
        const result = await attemptToExecuteRequest(request)

        if (!result) {
            erroredRequests.push(request)
        }
    }

    return erroredRequests
}

export async function attemptToExecuteRequest(request: NetworkRequest): Promise<boolean> {
    try {
        const response = await axios.request(request.requestConfig)
        request.executed = true

        if (request.onSuccess) {
            request.onSuccess(response.data)
        }
    } catch (e) {
        request.executed = false

        if (request.onError) {
            request.onError(e)
        }
    }

    return request.executed
}
