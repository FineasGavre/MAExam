import { defineStore } from 'pinia'
import { useNetworkStore } from '@/stores/network-store'
import { runNetworkCheck } from '@/services/network-check-service'
import { useMessageStore } from '@/stores/message-store'

export const useConfigurationStore = defineStore('configuration', {
    state: () => {
        return {
            isApplicationReady: false,
        }
    },
    actions: {
        async runInitialConfiguration() {
            runNetworkCheck()

            const networkStore = useNetworkStore()
            networkStore.setupNetworkStore()

            const messageStore = useMessageStore()
            messageStore.setupMessageStore()

            this.isApplicationReady = true
        },
    },
})
