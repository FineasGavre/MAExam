import { useNetworkStore } from '@/stores/network-store'
import { ConnectionStatus, Network } from '@capacitor/network'

export const runNetworkCheck = () => {
    const networkStore = useNetworkStore()

    const processStatus = (status: ConnectionStatus) => {
        networkStore.setConnectionState(status.connected)
    }

    Network.getStatus().then(processStatus)
    Network.addListener('networkStatusChange', processStatus)
}
