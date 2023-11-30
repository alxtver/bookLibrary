import { Module } from '@nestjs/common'
import { ScanningController } from './scanning.controller'
import { ScanningService } from './scanning.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Author } from '../authors/entities/author.entity'
import { Genre } from '../genres/entities/genre.entity'
import { Book } from '../books/entities/book.entity'
import { WebsocketGateway } from '../websocket/websocket.gateway'

@Module({
    controllers: [ScanningController],
    providers: [ScanningService, WebsocketGateway],
    imports: [TypeOrmModule.forFeature([Author, Genre, Book])]
})
export class ScanningModule {}
