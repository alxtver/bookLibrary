import { Injectable } from '@nestjs/common'
import { Genre } from './entities/genre.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

@Injectable()
export class GenresService {
    constructor(
        @InjectRepository(Genre)
        private genresRepository: Repository<Genre>
    ) {}
    async getAll(): Promise<Array<Genre>> {
        return await this.genresRepository.find()
    }
}
