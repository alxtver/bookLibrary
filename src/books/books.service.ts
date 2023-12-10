import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Book } from './entities/book.entity'
import * as fs from 'fs'

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>
    ) {}

    async getAll(): Promise<Array<Book>> {
        return await this.booksRepository.find({
            relations: {
                authors: true,
                genres: true
            }
        })
    }

    /**
     * Найти книгу по идентификатору
     * @param id
     */
    async getById(id: string): Promise<Book> {
        return (await this.booksRepository.findOne({
            where: {
                id
            },
            relations: {
                authors: true,
                genres: true
            }
        })) as Book
    }

    async loadBook(id: string): Promise<fs.ReadStream> {
        const book = (await this.booksRepository.findOne({
            where: {
                id
            }
        })) as Book
        return fs.createReadStream(book.path)
    }

    /**
     * Получить книгу по идентификатору автора
     * @param id
     */
    async getByAuthorId(id: string): Promise<Array<Book>> {
        return await this.booksRepository.find({
            where: { authors: { id: id } },
            relations: { authors: true }
        })
    }
}
