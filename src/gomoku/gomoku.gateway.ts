import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

@WebSocketGateway({ cors: true })
export class GomokuGateway {
    @WebSocketServer()
    server: Server

    private rooms: Map<string, string[]> = new Map()

    @SubscribeMessage('createRoom')
    handleCreateRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string }
    ): void {
        const { roomId } = data
        this.rooms.set(roomId, [client.id])
        client.join(roomId)
        client.emit('roomCreated', { roomId })
    }

    @SubscribeMessage('joinRoom')
    handleJoinRoom(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string }
    ): void {
        const { roomId } = data
        const room = this.rooms.get(roomId)
        if (room && room.length < 2) {
            room.push(client.id)
            client.join(roomId)
            client.emit('roomJoined', { roomId })
            this.server.to(roomId).emit('startGame')
        } else {
            client.emit('roomFull')
        }
    }

    @SubscribeMessage('move')
    handleMove(
        @ConnectedSocket() client: Socket,
        @MessageBody() data: { roomId: string; move: any }
    ): void {
        const { roomId, move } = data
        this.server.to(roomId).emit('move', move)
    }
}
