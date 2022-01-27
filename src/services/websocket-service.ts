type WebSocketDataCallback = (data: object) => void

export class WebSocketService {
    private webSocketConnection?: WebSocket
    private initialWebSocketUrl: string
    private onDataCallbacks: WebSocketDataCallback[] = []

    constructor(url: string) {
        this.initialWebSocketUrl = url

        this.openWebSocketConnection()
        this.setupConnectionEvents()
        this.setupConnectionRetryChecker()
    }

    public addDataCallback(callback: WebSocketDataCallback): void {
        this.onDataCallbacks.push(callback)
    }

    private openWebSocketConnection(): void {
        this.webSocketConnection = new WebSocket(this.initialWebSocketUrl)
    }

    private setupConnectionEvents(): void {
        this.webSocketConnection?.addEventListener('open', () => {
            console.log('WebSocket connection opened.')
        })

        this.webSocketConnection?.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            this.onDataCallbacks.forEach((cb) => cb(data))
        })

        this.webSocketConnection?.addEventListener('error', (event) => {
            console.error('A WebSocket error has occurred.', event)
        })
    }

    private setupConnectionRetryChecker(): void {
        setInterval(() => {
            if (this.webSocketConnection?.readyState === WebSocket.CLOSED) {
                this.openWebSocketConnection()
            }
        }, 5000)
    }
}
