import { Injectable } from '@nestjs/common'
import { Author } from './entities/author.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>
    ) {}

    /**
     * Получить всех авторов
     */
    async getAll(): Promise<Array<Author>> {
        return await this.authorsRepository.find()
    }
}
