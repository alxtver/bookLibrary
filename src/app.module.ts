import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { config } from './config/config'
import { AuthorsModule } from './authors/authors.module'
import { TypeOrmModule } from '@nestjs/typeorm'
import * as process from 'process'
import { Author } from './authors/entities/author.entity'
import { ScanningModule } from './scanning/scanning.module'
import { BooksModule } from './books/books.module'
import { GenresModule } from './genres/genres.module'
import { Book } from './books/entities/book.entity'
import { Genre } from './genres/entities/genre.entity'
import { Image } from './images/entities/image.entity'
import { WebsocketGateway } from './websocket/websocket.gateway'
import { WebsocketModule } from './websocket/websocket.module'
import { ImagesModule } from './images/images.module'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [config]
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: 3306,
            username: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: 'book_library',
            entities: [Author, Book, Genre, Image],
            autoLoadEntities: true,
            synchronize: true
        }),
        ScanningModule,
        AuthorsModule,
        BooksModule,
        GenresModule,
        WebsocketModule,
        ImagesModule
    ],
    controllers: [AppController],
    providers: [AppService, WebsocketGateway]
})
export class AppModule {}
