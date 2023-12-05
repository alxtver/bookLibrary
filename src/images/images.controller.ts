import { Controller, Get, Query } from '@nestjs/common'
import { ImagesService } from './images.service'

@Controller('images')
export class ImagesController {
    constructor(private readonly imagesService: ImagesService) {}

    /**
     * Найти изображения по идентификатору книги
     * @param bookId
     */
    @Get('/getByBookId')
    findOne(@Query('bookId') bookId: string) {
        return this.imagesService.getByBookId(bookId)
    }
}
