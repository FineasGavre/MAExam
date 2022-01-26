<template>
    <ion-item>
        <ion-label>Network status: {{ isConnected }}</ion-label>
    </ion-item>
</template>

<script lang="ts">
    import { useNetworkStore } from '@/stores/network-store'
    import { IonLabel, IonItem } from '@ionic/vue'
    import { storeToRefs } from 'pinia'
    import { defineComponent } from 'vue'

    export default defineComponent({
        name: 'NetworkStatusItem',
        components: {
            IonItem,
            IonLabel,
        },
        setup() {
            const networkStore = useNetworkStore()
            const { isConnected } = storeToRefs(networkStore)

            return {
                isConnected,
            }
        },
    })
</script>
