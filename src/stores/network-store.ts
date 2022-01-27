import axios from 'axios'
import { defineStore } from 'pinia'
import { attemptToExecuteRequest, attemptToExecuteRequests, NetworkRequest } from '@/utils/network-utils'
import { useMessageStore } from '@/stores/message-store'
import { WebSocketService } from '@/services/websocket-service'
import { Message } from '@/interfaces/message'

const NETWORK_CONSTANTS = {
    API_URL: 'http://localhost:3000',
    WS_URL: 'ws://localhost:3000',
} as const

export const useNetworkStore = defineStore('network', {
    state: () => {
        return {
            pendingRequests: new Array<NetworkRequest>(),
            isConnected: false,
        }
    },
    actions: {
        async setupNetworkStore() {
            this.setupApiRequestsHandler()
            this.setupWebSocketConnection()
        },
        setupApiRequestsHandler() {
            axios.defaults.baseURL = NETWORK_CONSTANTS.API_URL

            setInterval(() => {
                this.executePendingRequests().then()
            }, 2000)
        },
        setupWebSocketConnection() {
            const webSocketService = new WebSocketService(NETWORK_CONSTANTS.WS_URL)

            webSocketService.addDataCallback((data) => {
                const messageStore = useMessageStore()
                messageStore.appendMessage(data as Message)
            })
        },
        setConnectionState(connectionState: boolean) {
            this.isConnected = connectionState
        },
        async executeRequest(request: NetworkRequest): Promise<any> {
            return new Promise((resolve, reject) => {
                request.onSuccess = (data) => {
                    resolve(data)
                }

                request.onError = (error) => {
                    reject(error)
                }

                this.addPendingRequest(request)
            })
        },
        addPendingRequest(request: NetworkRequest) {
            if (!this.isConnected) {
                this.pendingRequests.push(request)
                return
            }

            attemptToExecuteRequest(request).then((executed) => {
                if (!executed) {
                    this.pendingRequests.push(request)
                }
            })
        },
        async executePendingRequests() {
            if (!this.isConnected) {
                return
            }

            const requests = [...this.pendingRequests]
            this.pendingRequests = []
            this.pendingRequests = await attemptToExecuteRequests(...requests)
        },
    },
})
