<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-title>Inbox</ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <network-status-item></network-status-item>
            <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
                <ion-refresher-content></ion-refresher-content>
            </ion-refresher>

            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Inbox</ion-title>
                </ion-toolbar>
            </ion-header>

            <ion-list>
                <ViewAllListItem v-for="message in messages" :key="message.id" :item="message" />
            </ion-list>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
    import { IonContent, IonHeader, IonList, IonPage, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from '@ionic/vue'
    import ViewAllListItem from '@/components/ViewAllListItem.vue'
    import NetworkStatusItem from '@/components/network/NetworkStatusItem.vue'
    import { useMessageStore } from '@/stores/message-store'
    import { storeToRefs } from 'pinia'

    const messageStore = useMessageStore()
    const { messages } = storeToRefs(messageStore)

    const refresh = (ev: CustomEvent) => {
        messageStore.prepareLoadMessages()
        setTimeout(() => {
            ev.detail.complete()
        }, 1000)
    }
</script>
