import { defineStore } from 'pinia'
import { useNetworkStore } from '@/stores/network-store'
import { useMessageStore } from '@/stores/message-store'
import { runNetworkCheck } from '@/services/network-check-service'

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
            await networkStore.setupNetworkStore()

            const messageStore = useMessageStore()
            await messageStore.setupMessageStore()

            this.isApplicationReady = true
        },
    },
})
