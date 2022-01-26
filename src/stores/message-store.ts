import { defineStore } from 'pinia'
import { Message } from '@/interfaces/message'
import { useNetworkStore } from '@/stores/network-store'
import { Storage } from '@capacitor/storage'

export const useMessageStore = defineStore('message', {
    state: () => {
        return {
            messages: new Array<Message>(),
        }
    },
    actions: {
        setupMessageStore() {
            this.prepareLoadMessages()
        },
        prepareLoadMessages() {
            this.fetchFromLocalStorage()

            const networkStore = useNetworkStore()
            networkStore.addPendingRequest({
                requestConfig: {
                    url: '/message',
                    method: 'GET',
                },
                onSuccess: (data: Message[]) => {
                    this.loadMessages(data)
                },
            })
        },
        loadMessages(messages: Message[]) {
            this.messages = messages
            this.persistToLocalStorage().then()
        },
        async fetchFromLocalStorage() {
            const { value } = await Storage.get({ key: 'messages' })

            if (value) {
                this.messages = JSON.parse(value)
            }
        },
        async persistToLocalStorage() {
            const dataForStorage = JSON.stringify(this.messages)

            await Storage.set({ key: 'messages', value: dataForStorage })
        },
    },
})
