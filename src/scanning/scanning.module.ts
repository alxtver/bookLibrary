import { Module } from '@nestjs/common'
import { ScanningController } from './scanning.controller'
import { ScanningService } from './scanning.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Author } from '../authors/entities/author.entity'
import { Genre } from '../genres/entities/genre.entity'
import { Book } from '../books/entities/book.entity'

@Module({
    controllers: [ScanningController],
    providers: [ScanningService],
    imports: [TypeOrmModule.forFeature([Author, Genre, Book])]
})
export class ScanningModule {}
