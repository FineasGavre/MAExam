<template>
    <ion-item v-if="item" :detail="false" class="list-item" @click="markAsRead">
        <div slot="start" :class="!item.read ? 'dot dot-unread' : 'dot'"></div>
        <ion-label class="ion-text-wrap">
            <h2>
                {{ item.sender }}
                <span class="date">
                    <ion-note>{{ messageDate }}</ion-note>
                    <ion-icon :icon="chevronForward" size="small" v-if="isIos()"></ion-icon>
                </span>
            </h2>
            <p>
                {{ item.text }}
            </p>
        </ion-label>
    </ion-item>
</template>

<script setup lang="ts">
    import moment from 'moment'
    import { IonIcon, IonItem, IonLabel, IonNote } from '@ionic/vue'
    import { computed, toRefs } from 'vue'
    import { Message } from '@/interfaces/message'
    import { chevronForward } from 'ionicons/icons'
    import { useMessageStore } from '@/stores/message-store'

    const props = defineProps<{
        item: Message
    }>()

    const { item } = toRefs(props)
    const messageDate = computed(() => moment(item.value.created).format('DD-MM-YYYY HH:MM'))

    const messageStore = useMessageStore()

    const markAsRead = () => {
        messageStore.markMessageAsRead(item.value.id)
    }

    const isIos = () => {
        const win = window as any
        return win && win.Ionic && win.Ionic.mode === 'ios'
    }
</script>

<style scoped>
    .list-item {
        --padding-start: 0;
        --inner-padding-end: 0;
    }

    .list-item ion-label {
        margin-top: 12px;
        margin-bottom: 12px;
    }

    .list-item h2 {
        font-weight: 600;
        margin: 0;
    }

    .list-item p {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 95%;
    }

    .list-item .date {
        float: right;
        align-items: center;
        display: flex;
    }

    .list-item ion-icon {
        color: #c9c9ca;
    }

    .list-item ion-note {
        font-size: 15px;
        margin-right: 8px;
        font-weight: normal;
    }

    .list-item ion-note.md {
        margin-right: 14px;
    }

    .list-item .dot {
        display: block;
        height: 12px;
        width: 12px;
        border-radius: 50%;
        align-self: start;
        margin: 16px 10px 16px 16px;
    }

    .list-item .dot-unread {
        background: var(--ion-color-primary);
    }
</style>
