import { Injectable } from '@nestjs/common'
import { CreateBookDto } from './dto/create-book.dto'
import { UpdateBookDto } from './dto/update-book.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Book } from './entities/book.entity'

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private booksRepository: Repository<Book>
    ) {}
    create(createBookDto: CreateBookDto) {
        return 'This action adds a new book'
    }

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

    update(id: number, updateBookDto: UpdateBookDto) {
        return `This action updates a #${id} book`
    }

    remove(id: number) {
        return `This action removes a #${id} book`
    }
}
