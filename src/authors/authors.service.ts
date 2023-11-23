import { Injectable } from '@nestjs/common'
import { CreateAuthorDto } from './dto/create-author.dto'
import { UpdateAuthorDto } from './dto/update-author.dto'
import { Author } from './entities/author.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { v4 as uuidv4 } from 'uuid'

@Injectable()
export class AuthorsService {
    constructor(
        @InjectRepository(Author)
        private authorsRepository: Repository<Author>
    ) {}

    create(createAuthorDto: CreateAuthorDto) {
        return 'This action adds a new author'
    }

    findAll() {
        return `This action returns all authors`
    }

    findOne(id: number) {
        return `This action returns a #${id} author`
    }

    update(id: number, updateAuthorDto: UpdateAuthorDto) {
        return `This action updates a #${id} author`
    }

    remove(id: number) {
        return `This action removes a #${id} author`
    }

    async addEmpty(author: CreateAuthorDto): Promise<void> {
        await this.authorsRepository.save(author)
    }
}
