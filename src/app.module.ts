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
            entities: [Author],
            autoLoadEntities: true,
            synchronize: true
        }),
        AuthorsModule,
        ScanningModule
    ],
    controllers: [AppController],
    providers: [AppService]
})
export class AppModule {}
