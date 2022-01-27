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
        async setupMessageStore() {
            await this.prepareLoadMessages()
        },
        async prepareLoadMessages() {
            await this.fetchFromLocalStorage()

            const networkStore = useNetworkStore()
            const messages: Message[] = await networkStore.executeRequest({
                requestConfig: {
                    url: '/message',
                    method: 'GET',
                },
            })

            this.loadMessages(messages)
        },
        loadMessages(messages: Message[]) {
            this.messages = messages
            this.persistToLocalStorage().then()
        },
        appendMessage(message: Message) {
            this.messages.push(message)
            this.persistToLocalStorage().then()
        },
        markMessageAsRead(id: number) {
            const message = this.messages.find((m) => m.id === id)
            if (!message || message.read) {
                return
            }

            message.read = true

            // Setup Network Request
            const networkStore = useNetworkStore()
            networkStore.addPendingRequest({
                requestConfig: {
                    url: `/message/${id}`,
                    method: 'PUT',
                    data: message,
                },
                onSuccess: () => {
                    this.persistToLocalStorage().then()
                },
            })
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
