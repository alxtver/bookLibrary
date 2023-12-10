import { Controller, Get } from '@nestjs/common'
import { GenresService } from './genres.service'
import { Genre } from './entities/genre.entity'

@Controller('genres')
export class GenresController {
    constructor(private readonly genresService: GenresService) {}

    @Get('getAll')
    async getAll(): Promise<Array<Genre>> {
        return await this.genresService.getAll()
    }
}
