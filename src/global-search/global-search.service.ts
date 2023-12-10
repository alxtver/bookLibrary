import { Injectable } from '@nestjs/common'
import { SearchDto } from './global-search.controller'
import { InjectRepository } from '@nestjs/typeorm'
import { Author } from '../authors/entities/author.entity'
import { Like, Repository } from 'typeorm'
import { Book } from '../books/entities/book.entity'

@Injectable()
export class GlobalSearchService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>,

        @InjectRepository(Book)
        private booksRepository: Repository<Book>
    ) {}
    async search(pattern: string): Promise<SearchDto> {
        const authors = await this.authorsRepository.find({
            where: [{ firstName: Like(`%${pattern}%`) }, { lastName: Like(`%${pattern}%`) }]
        })
        const books = await this.booksRepository.find({
            where: {
                title: Like(`%${pattern}%`)
            }
        })
        return { authors, books }
    }
}
