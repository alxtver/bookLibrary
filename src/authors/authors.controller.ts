import { Controller, Get } from '@nestjs/common'
import { AuthorsService } from './authors.service'
import { Author } from './entities/author.entity'

@Controller('authors')
export class AuthorsController {
    constructor(private readonly authorsService: AuthorsService) {}

    /**
     * Получить всех авторов
     */
    @Get('getAll')
    async getAll(): Promise<Array<Author>> {
        return await this.authorsService.getAll()
    }
}
