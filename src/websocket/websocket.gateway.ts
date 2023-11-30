import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets'
import { Server } from 'socket.io'

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class WebsocketGateway {
    @WebSocketServer()
    server: Server
    @SubscribeMessage('message')
    public handleMessage(client: any, payload: any): string {
        return 'Hello world!'
    }

    public sendMessage(message: string): void {
        this.server.emit('message', message)
    }

    public sendProgress(data: { count: number; current: number }): void {
        this.server.emit('progress', data)
    }

    public sendStart(): void {
        this.server.emit('startScanning')
    }

    public sendEnd(): void {
        this.server.emit('endScanning')
    }
}
