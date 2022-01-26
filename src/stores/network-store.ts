import { defineStore } from 'pinia'
import axios from 'axios'
import { attemptToExecuteRequests, NetworkRequest } from '@/utils/network-utils'

export const useNetworkStore = defineStore('network', {
    state: () => {
        return {
            pendingRequests: new Array<NetworkRequest>(),
            isConnected: false,
        }
    },
    actions: {
        setupNetworkStore() {
            axios.defaults.baseURL = 'http://localhost:3000'

            setInterval(() => {
                this.executePendingRequests().then()
            }, 2000)
        },
        setConnectionState(connectionState: boolean) {
            this.isConnected = connectionState
        },
        addPendingRequest(request: NetworkRequest) {
            this.pendingRequests.push(request)
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